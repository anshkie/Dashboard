'use client';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function CityDetails() {
  const params = useParams();
const city = decodeURIComponent(params.city || '');
  const weather = useSelector((state) => state.weather.data[city]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!weather) return;

    const fetchHistory = async () => {
      const { lat, lon } = weather.coord;
      const end = new Date();
      const start = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

      const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=${formatDate(start)}&end_date=${formatDate(end)}&hourly=temperature_2m&timezone=auto`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const tempsByDay = {};
        data.hourly.time.forEach((time, idx) => {
          const day = new Date(time).toLocaleDateString('en-US', { weekday: 'short' });
          if (!tempsByDay[day]) tempsByDay[day] = [];
          tempsByDay[day].push(data.hourly.temperature_2m[idx]);
        });

        const results = Object.entries(tempsByDay).map(([day, temps]) => ({
          day,
          temp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
          condition: 'N/A',
        }));

        setHistory(results);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };

    fetchHistory();
  }, [weather]);

  if (!weather) return <p className="text-center text-gray-500 mt-10">Loading weather for <span className="font-semibold">{city}</span>...</p>;

  const chartData = {
    labels: history.map((d) => d.day),
    datasets: [
      {
        label: 'Temp (°C)',
        data: history.map((d) => d.temp),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
  <button
    onClick={() => window.history.back()}
    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
  >
    ← Back to Dashboard
  </button>
  <h1 className="text-3xl font-bold text-gray-800">{city} - Weather Details</h1>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Info Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
          <p><span className="font-semibold text-gray-700">Temperature:</span> {weather.main.temp} °C</p>
          <p><span className="font-semibold text-gray-700">Humidity:</span> {weather.main.humidity}%</p>
          <p><span className="font-semibold text-gray-700">Pressure:</span> {weather.main.pressure} hPa</p>
          <p><span className="font-semibold text-gray-700">Condition:</span> {weather.weather[0].description}</p>
          <p><span className="font-semibold text-gray-700">Wind Speed:</span> {weather.wind.speed} m/s</p>
        </div>

        {/* Chart Card */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <Line data={chartData} />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 p-4 border-b">Past 5 Days</h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Day</th>
              <th className="p-3">Avg Temp (°C)</th>
              <th className="p-3">Condition</th>
            </tr>
          </thead>
          <tbody>
            {history.map((d, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{d.day}</td>
                <td className="p-3">{d.temp}</td>
                <td className="p-3 text-gray-500">{d.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
