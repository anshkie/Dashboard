'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherByZip } from '@/redux/slices/weatherSlice';
import { fetchCryptos } from '@/redux/slices/cryptoSlice';
import { fetchNews } from '@/redux/slices/newsSlice';
import { useRouter } from 'next/navigation';
import useCryptoSocket from '@/hooks/useCryptoSocket';
import useWeatherAlerts from '@/hooks/useWeatherAlerts';
import { addCity, removeCity, addCrypto, removeCrypto } from '@/redux/slices/preferencesSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const alert = useWeatherAlerts();
  const livePrices = useCryptoSocket(['bitcoin', 'ethereum', 'solana']);
  const weather = useSelector((state) => state.weather.data);
  const status = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);
  const favoriteCities = useSelector((state) => state.preferences.favoriteCities);
  const favoriteCryptos = useSelector((state) => state.preferences.favoriteCryptos);
  const cryptoData = useSelector((state) => state.crypto.data || []);
  const cryptoError = useSelector((state) => state.crypto.error);
  const { articles } = useSelector((state) => state.news);

  const cities = [
    { name: 'New York', zip: '10001', country: 'us' },
    { name: 'London', zip: 'EC1A', country: 'gb' },
    { name: 'Tokyo', zip: '100-0001', country: 'jp' },
  ];

  useEffect(() => {
    dispatch(fetchCryptos());
    dispatch(fetchNews());
    cities.forEach((city) => {
      dispatch(fetchWeatherByZip({ zip: city.zip, country: city.country }));
    });

    const interval = setInterval(() => {
      dispatch(fetchCryptos());
      dispatch(fetchNews());
      cities.forEach((city) => {
        dispatch(fetchWeatherByZip({ zip: city.zip, country: city.country }));
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="p-4 space-y-10 bg-gray-50 min-h-screen">
      {alert && (
        <div className="bg-red-100 text-red-800 p-3 rounded border border-red-300 animate-pulse">
          🚨 {alert}
        </div>
      )}

      {/* 🌤️ Weather Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow inline-block">
          🌤️ Weather Dashboard
        </h1>
        {status === 'loading' && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {Object.keys(weather).length === 0 && status !== 'loading' ? (
          <p className="text-red-500">
            Failed to load weather data.{' '}
            <button className="underline" onClick={() => cities.forEach(city => dispatch(fetchWeatherByZip(city)))}>
              Retry
            </button>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(weather).map(([city, data]) => (
              <div
                key={city}
                className="p-4 border rounded shadow bg-white hover:bg-blue-100 transition"
                onClick={() => router.push(`/weather/${encodeURIComponent(city)}`)}
              >
                <h2 className="text-lg font-semibold text-blue-700">{city}</h2>
                <p>Temperature: {data.main?.temp} °C</p>
                <p>Weather: {data.weather?.[0]?.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addCity(city));
                  }}
                  className="text-xs text-blue-600 hover:underline mt-2 block"
                >
                  Add to Favorites
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 💰 Crypto Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow inline-block">
          💰 Crypto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cryptoData.length === 0 ? (
            <p className="text-red-500">
              Failed to load crypto data.{' '}
              <button onClick={() => dispatch(fetchCryptos())} className="underline">
                Retry
              </button>
            </p>
          ) : (
            cryptoData.map((crypto) => {
              const symbol = crypto.symbol.toLowerCase() + 'usdt';
              const livePrice = livePrices[symbol];

              return (
                <div
                  key={crypto.id}
                  className="p-4 border rounded bg-white shadow hover:bg-green-100 transition cursor-pointer"
                  onClick={() => router.push(`/crypto/${crypto.id}`)}
                >
                  <h3 className="text-lg font-bold text-green-700">{crypto.name}</h3>
                  <p>
                    Price: $
                    <span className="font-semibold">
                      {livePrice
                        ? parseFloat(livePrice).toFixed(2)
                        : parseFloat(crypto.priceUsd).toFixed(2)}
                    </span>
                    {livePrice ? (
                      <span className="text-xs text-green-600 ml-1">(live)</span>
                    ) : (
                      <span className="text-xs text-gray-400 ml-1">(delayed)</span>
                    )}
                  </p>
                  <p>24h Change: {parseFloat(crypto.changePercent24Hr).toFixed(2)}%</p>
                  <p>
                    Market Cap: ${parseFloat(crypto.marketCapUsd / 1e9).toFixed(2)} B
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addCrypto(crypto.symbol.toLowerCase()));
                    }}
                    className="text-xs text-blue-500 hover:underline mt-2 block"
                  >
                    Add to Favorites
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 📰 News Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow inline-block">
          📰 Crypto News
        </h2>
        {status === 'loading' && <p>Loading news...</p>}

{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    <strong>Error:</strong> {error}
  </div>
)}

{status === 'succeeded' && articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={index} className="bg-white p-4 border rounded shadow hover:bg-yellow-50 transition">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">{article.pubDate}</p>
            </li>
          ))}
        </ul>
):status === 'succeeded' ? (
  <p>No articles found.</p>
) : null}
      </section>

      {/* ⭐ Favorites Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md shadow inline-block">
          ⭐ Favorites
        </h2>

        {/* Cities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Cities</h3>
          {favoriteCities.length === 0 ? (
            <p className="text-sm text-gray-500">No favorite cities yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favoriteCities.map((city) => (
                <div key={city} className="p-4 border rounded shadow bg-white">
                  <h4 className="font-bold text-lg text-purple-700">{city}</h4>
                  <button
                    onClick={() => dispatch(removeCity(city))}
                    className="text-sm text-red-600 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cryptos */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Cryptos</h3>
          {favoriteCryptos.length === 0 ? (
            <p className="text-sm text-gray-500">No favorite cryptos yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favoriteCryptos.map((symbol) => {
                const crypto = cryptoData.find((c) => c.symbol.toLowerCase() === symbol);
                const livePrice = livePrices[symbol + 'usdt'];
                return (
                  <div key={symbol} className="p-4 border rounded shadow bg-white">
                    <h4 className="font-bold text-lg text-purple-700">{crypto?.name}</h4>
                    <p>
                      Price: $
                      <span className="font-semibold text-green-700">
                        {livePrice
                          ? parseFloat(livePrice).toFixed(2)
                          : parseFloat(crypto?.priceUsd || 0).toFixed(2)}
                      </span>
                    </p>
                    <button
                      onClick={() => dispatch(removeCrypto(symbol))}
                      className="text-sm text-red-600 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
