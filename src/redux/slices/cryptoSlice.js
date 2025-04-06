import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://api.coincap.io/v2/assets?limit=3`);

      if (res.status === 429) {
        return rejectWithValue({ error: 'Rate limit exceeded. Please wait.' });
      }

      const data = await res.json();
      return data.data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);


const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cryptoSlice.reducer;
