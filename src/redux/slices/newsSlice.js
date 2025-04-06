// src/redux/slices/newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (query, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&q=undefined&language=en
`
      );
      if (!res.ok) {
        if (res.status === 401) {
          return rejectWithValue('Unauthorized access. Please check your API key.');
        }
        if (res.status === 429) {
          return rejectWithValue('Too many requests. Please try again later.');
        }
        throw new Error('Failed to fetch news');
      }
      

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.results;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default newsSlice.reducer;
