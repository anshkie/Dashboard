import { useEffect, useState, useRef } from 'react';

export default function useCryptoSocket(cryptos = []) {
  const [prices, setPrices] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    const symbols = cryptos.map((c) => {
      if (c === 'bitcoin') return 'btcusdt';
      if (c === 'ethereum') return 'ethusdt';
      if (c === 'solana') return 'solusdt';
      return '';
    }).filter(Boolean);

    const streamQuery = symbols.map((s) => `${s}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamQuery}`);
    wsRef.current = ws;

    console.log('🔌 Connected to Binance WebSocket');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const stream = data?.stream;
      const ticker = data?.data;
      if (!ticker || !stream) return;

      const symbol = stream.split('@')[0];
      setPrices((prev) => ({
        ...prev,
        [symbol]: ticker.c, // latest price
      }));
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.onclose = (e) => {
      console.warn('⚠️ WebSocket closed', e.reason);
    };

    return () => {
      console.log('🧹 Cleaning up WebSocket');
      ws.close(1000, 'Component unmounted');
    };
  }, [cryptos.join(',')]); // dependency on stringified array

  return prices;
}
