import { createSlice } from '@reduxjs/toolkit';

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
    // Add these new reducers for optimistic updates
    upvoteCommentOptimistic(state, action) {
      const { commentId, userId } = action.payload;
      const comment = state.comments.find(c => c._id === commentId);
      if (comment) {
        // First remove any existing downvote
        comment.downvotes = comment.downvotes.filter(vote => ( vote.entity._id || vote.entity ).toString() !== userId);
        
        // Check if user already upvoted
        const existingUpvoteIndex = comment.upvotes.findIndex(
          vote => ( vote.entity._id || vote.entity ).toString() === userId
        );
        
        // Toggle upvote
        if (existingUpvoteIndex >= 0) {
          // Remove upvote if already exists
          comment.upvotes.splice(existingUpvoteIndex, 1);
        } else {
          // Add upvote if doesn't exist
          comment.upvotes.push({ entity: {_id: userId}, model: 'User' });
        }
      }
    },

    downvoteCommentOptimistic(state, action) {
      const { commentId, userId } = action.payload;
      const comment = state.comments.find(c => c._id === commentId);
      if (comment) {
        // First remove any existing upvote
        comment.upvotes = comment.upvotes.filter(vote => ( vote.entity._id || vote.entity ).toString() !== userId);
        
        // Check if user already downvoted
        const existingDownvoteIndex = comment.downvotes.findIndex(
          vote => ( vote.entity._id || vote.entity ).toString() === userId
        );
        
        // Toggle downvote
        if (existingDownvoteIndex >= 0) {
          // Remove downvote if already exists
          comment.downvotes.splice(existingDownvoteIndex, 1);
        } else {
          // Add downvote if doesn't exist
          comment.downvotes.push({ entity: {_id: userId}, model: 'User' });
        }
      }
    },

    updateCommentAfterVote(state, action) {
      const updatedComment = action.payload;
      const index = state.comments.findIndex(c => c._id === updatedComment._id);
      if (index !== -1) {
        state.comments[index] = updatedComment;
      }
    },

    updateReplyVotes(state, action) {
      const { commentId, replyId, upvotes, downvotes } = action.payload;
      const commentIndex = state.comments.findIndex(c => c._id === commentId);
      if (commentIndex !== -1) {
        const replyIndex = state.comments[commentIndex].replies.findIndex(r => r._id === replyId);
        if (replyIndex !== -1) {
          state.comments[commentIndex].replies[replyIndex].upvotes = upvotes;
          state.comments[commentIndex].replies[replyIndex].downvotes = downvotes;
        }
      }
    },

    deleteComment: (state, action) => {
      const commentId = action.payload;
      state.comments = state.comments.filter(comment => comment._id !== commentId);
    },

    deleteReply: (state, action) => {
      const { commentId, replyId } = action.payload;
      const commentIndex = state.comments.findIndex(c => c._id === commentId);
      if (commentIndex !== -1) {
        state.comments[commentIndex].replies = state.comments[commentIndex].replies.filter(
          reply => reply._id !== replyId
        );
      }
    },
  },
});

export const {
  loadCommentsStart,
  loadCommentsSuccess,
  addCommentSuccess,
  commentsFailure,
  upvoteCommentOptimistic,
  downvoteCommentOptimistic,
  updateCommentAfterVote,
  updateReplyVotes,
  deleteComment,
  deleteReply
} = commentsSlice.actions;

export default commentsSlice.reducer;