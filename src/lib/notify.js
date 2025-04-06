import toast from 'react-hot-toast';

export const notify = ({ type, message, data }) => {
  switch (type) {
    case 'price_alert':
      toast.success(`📈 ${message}: ${data.symbol} hit $${data.price}`);
      break;
    case 'weather_alert':
      toast.error(`🌩️ ${message}`);
      break;
    default:
      toast(`🔔 ${message}`);
  }
};
