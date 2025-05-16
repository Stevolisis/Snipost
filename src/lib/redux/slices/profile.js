// src/lib/redux/slices/profile.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  transactions: [],
  earned: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    loadProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadProfileSuccess(state, action) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    loadProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loadTransactionsSuccess(state, action) {
      state.transactions = action.payload;
    },
    loadEarningsSuccess(state, action) {
      state.earned = action.payload;
    },
    resetProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
  loadTransactionsSuccess,
  loadEarningsSuccess,
  resetProfile
} = profileSlice.actions;

export default profileSlice.reducer;