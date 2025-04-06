'use client';
import { useEffect, useState } from 'react';
import { notify } from '@/lib/notify'; // <-- make sure this path is correct

const alerts = [
  '🌪️ Storm approaching!',
  '🔥 Extreme heat alert!',
  '🌧️ Heavy rain forecast!',
  '🌫️ Fog warning!',
  '❄️ Snowstorm incoming!',
];

export default function useWeatherAlerts() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        setAlert(randomAlert);

        // 🔔 Trigger toast notification
        notify({
          type: 'weather_alert',
          message: randomAlert,
        });

        // Auto-dismiss from local state if needed
        setTimeout(() => setAlert(null), 6000);
      }
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return alert;
}
