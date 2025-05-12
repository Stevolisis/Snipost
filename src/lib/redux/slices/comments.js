import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    loadCommentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadCommentsSuccess(state, action) {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCommentSuccess(state, action) {
      state.comments.unshift(action.payload);
    },
    commentsFailure(state, action) {
      state.loading = false;
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