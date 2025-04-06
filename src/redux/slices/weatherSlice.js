// src/redux/slices/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeatherByZip = createAsyncThunk(
  'weather/fetchWeatherByZip',
  async ({ zip, country }, { rejectWithValue }) => {
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},${country}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
      );
      if (!geoRes.ok) {
        throw new Error('Invalid ZIP code or location not found');
      }
      const geoData = await geoRes.json();
      const { lat, lon, name } = geoData;

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      return { zip, location: name, weather: weatherData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByZip.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherByZip.fulfilled, (state, action) => {
        const { location, weather } = action.payload;
        state.data[location] = weather;
        state.status = 'succeeded';
      })
      .addCase(fetchWeatherByZip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
