// store/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weather: {},
  crypto: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setWeatherData: (state, action) => {
      state.weather = { ...state.weather, ...action.payload };
    },
    setCryptoData: (state, action) => {
      state.crypto = { ...state.crypto, ...action.payload };
    },
  },
});

export const { setWeatherData, setCryptoData } = dataSlice.actions;
export default dataSlice.reducer;
