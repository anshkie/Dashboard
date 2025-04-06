'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptos } from '@/redux/slices/cryptoSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CryptoDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const crypto = useSelector((state) =>
    state.crypto.data.find((coin) => coin.id === id)
  );
  const [historyData, setHistoryData] = useState([]);

  // Fetch all cryptos if not present
  useEffect(() => {
    if (!crypto) {
      dispatch(fetchCryptos());
    }
  }, [crypto, dispatch]);

  // Fetch real historical price data for selected coin
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
        );
        const json = await res.json();
        console.log(json.data);

        if (Array.isArray(json.data)) {
          setHistoryData(json.data.slice(-7)); // last 7 days
        } else {
          console.error('Unexpected data format:', json.data);
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    if (id) fetchHistory();
  }, [id]);

  if (!crypto)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading or no data for {id}...</p>
      </div>
    );

  const chartData = {
    labels: historyData.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price (USD)',
        data: historyData.map((d) => parseFloat(d.priceUsd)),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4F46E5',
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl mt-6 space-y-8">
      {/* Header + Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-indigo-700">
          {crypto.name} <span className="text-gray-500 text-lg">({crypto.symbol})</span>
        </h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-800">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-xl font-semibold text-indigo-600">${parseFloat(crypto.priceUsd).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Market Cap</p>
          <p className="text-lg font-semibold">${(crypto.marketCapUsd / 1e9).toFixed(2)} B</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">24h Volume</p>
          <p className="text-lg font-semibold">${(crypto.volumeUsd24Hr / 1e9).toFixed(2)} B</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Supply</p>
          <p className="text-lg font-semibold">{(crypto.supply / 1e6).toFixed(2)} M</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Change (24h)</p>
          <p className={`text-lg font-semibold ${crypto.changePercent24Hr > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
          </p>
        </div>
        {crypto.maxSupply && (
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-sm text-gray-500">Max Supply</p>
            <p className="text-lg font-semibold">{(crypto.maxSupply / 1e6).toFixed(2)} M</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">7-Day Price History</h2>
        {historyData.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-500 text-sm">Loading chart...</p>
        )}
      </div>
    </div>
  );
}
