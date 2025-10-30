// src/lib/redux/slices/documentations.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  docs: [],
  isLoading: false,
  error: null,
};

const documentationsSlice = createSlice({
  name: "documentations",
  initialState,
  reducers: {
    loadDocsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loadDocsSuccess(state, action) {
      state.docs = action.payload;
      state.isLoading = false;
    },
    docsFailure(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearDocs(state) {
      state.docs = [];
    },
  },
});

export const {
  loadDocsStart,
  loadDocsSuccess,
  docsFailure,
  clearDocs,
} = documentationsSlice.actions;

export default documentationsSlice.reducer;
