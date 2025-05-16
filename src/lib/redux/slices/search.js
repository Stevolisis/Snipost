// src/lib/redux/slices/search.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  results: [],
  isLoading: false,
  error: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    searchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    searchSuccess(state, action) {
      state.results = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    searchFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const {
  setSearchQuery,
  searchStart,
  searchSuccess,
  searchFailure,
  clearSearch
} = searchSlice.actions;

export default searchSlice.reducer;