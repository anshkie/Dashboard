// store/preferencesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCities: [],
  favoriteCryptos: [],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    addCity: (state, action) => {
      if (!state.favoriteCities.includes(action.payload)) {
        state.favoriteCities.push(action.payload);
      }
    },
    removeCity: (state, action) => {
      state.favoriteCities = state.favoriteCities.filter((c) => c !== action.payload);
    },
    addCrypto: (state, action) => {
      if (!state.favoriteCryptos.includes(action.payload)) {
        state.favoriteCryptos.push(action.payload);
      }
    },
    removeCrypto: (state, action) => {
      state.favoriteCryptos = state.favoriteCryptos.filter((c) => c !== action.payload);
    },
  },
});

export const { addCity, removeCity, addCrypto, removeCrypto } = preferencesSlice.actions;
export default preferencesSlice.reducer;
