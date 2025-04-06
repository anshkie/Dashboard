import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import cryptoReducer from './slices/cryptoSlice';
import newsReducer from './slices/newsSlice';
import preferencesReducer from './slices/preferencesSlice';
import dataReducer from './slices/dataSlice';
const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    data: dataReducer,
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
  },
});

export default store;