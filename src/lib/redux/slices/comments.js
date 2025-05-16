import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    loadCommentsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loadCommentsSuccess(state, action) {
      state.comments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCommentSuccess(state, action) {
      state.comments.unshift(action.payload);
    },
    commentsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loadCommentsStart,
  loadCommentsSuccess,
  addCommentSuccess,
  commentsFailure,
} = commentsSlice.actions;

export default commentsSlice.reducer;