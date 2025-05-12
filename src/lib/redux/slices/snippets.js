import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snippets: [],
  trendingSnippets: [],
  isLoading: false,
  error: null,
  currentSnippet: null
};

const snippetsSlice = createSlice({
  name: "snippets",
  initialState,
  reducers: {
    // When loading snippets starts
    loadSnippetsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When snippets are loaded successfully
    loadSnippetsSuccess(state, action) {
      state.snippets = action.payload;
      state.isLoading = false;
    },
    
    // When loading trending snippets starts
    loadTrendingSnippetsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When trending snippets are loaded successfully
    loadTrendingSnippetsSuccess(state, action) {
      state.trendingSnippets = action.payload;
      state.isLoading = false;
    },
    
    // When loading a single snippet starts
    loadSnippetStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When a single snippet is loaded successfully
    loadSnippetSuccess(state, action) {
      state.currentSnippet = action.payload;
      state.isLoading = false;
    },
    
    // When any snippet operation fails
    snippetsFailure(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // When upvoting/downvoting starts
    voteSnippetStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When upvoting succeeds
    upvoteSnippetSuccess(state, action) {
      const { snippetId, userId } = action.payload;
      
      // Update in snippets array
      state.snippets = state.snippets.map(snippet => {
        if (snippet._id === snippetId) {
          // Remove existing downvote if exists
          const downvotes = snippet.downvotes.filter(v => v.entity._id !== userId);
          // Add upvote if not already exists
          const hasUpvoted = snippet.upvotes.some(v => v.entity._id === userId);
          const upvotes = hasUpvoted 
            ? snippet.upvotes 
            : [...snippet.upvotes, { entity: { _id: userId }, model: 'User' }];
            
          return {
            ...snippet,
            upvotes,
            downvotes,
            upvoteCount: upvotes.length,
            downvoteCount: downvotes.length,
            netVotes: upvotes.length - downvotes.length
          };
        }
        return snippet;
      });
      
      // Update in trendingSnippets array
      state.trendingSnippets = state.trendingSnippets.map(snippet => {
        if (snippet._id === snippetId) {
          // Same logic as above
          const downvotes = snippet.downvotes.filter(v => v.entity._id !== userId);
          const hasUpvoted = snippet.upvotes.some(v => v.entity._id === userId);
          const upvotes = hasUpvoted 
            ? snippet.upvotes 
            : [...snippet.upvotes, { entity: { _id: userId }, model: 'User' }];
            
          return {
            ...snippet,
            upvotes,
            downvotes,
            upvoteCount: upvotes.length,
            downvoteCount: downvotes.length,
            netVotes: upvotes.length - downvotes.length
          };
        }
        return snippet;
      });
      
      // Update current snippet if it's the one being voted on
      if (state.currentSnippet?._id === snippetId) {
        const downvotes = state.currentSnippet.downvotes.filter(v => v.entity._id !== userId);
        const hasUpvoted = state.currentSnippet.upvotes.some(v => v.entity._id === userId);
        const upvotes = hasUpvoted 
          ? state.currentSnippet.upvotes 
          : [...state.currentSnippet.upvotes, { entity: { _id: userId }, model: 'User' }];
          
        state.currentSnippet = {
          ...state.currentSnippet,
          upvotes,
          downvotes,
          upvoteCount: upvotes.length,
          downvoteCount: downvotes.length,
          netVotes: upvotes.length - downvotes.length
        };
      }
      
      state.isLoading = false;
    },
    
    // When downvoting succeeds
    downvoteSnippetSuccess(state, action) {
      const { snippetId, userId } = action.payload;
      
      // Similar logic to upvote but inverted
      state.snippets = state.snippets.map(snippet => {
        if (snippet._id === snippetId) {
          // Remove existing upvote if exists
          const upvotes = snippet.upvotes.filter(v => v.entity._id !== userId);
          // Add downvote if not already exists
          const hasDownvoted = snippet.downvotes.some(v => v.entity._id === userId);
          const downvotes = hasDownvoted 
            ? snippet.downvotes 
            : [...snippet.downvotes, { entity: { _id: userId }, model: 'User' }];
            
          return {
            ...snippet,
            upvotes,
            downvotes,
            upvoteCount: upvotes.length,
            downvoteCount: downvotes.length,
            netVotes: upvotes.length - downvotes.length
          };
        }
        return snippet;
      });
      
      state.trendingSnippets = state.trendingSnippets.map(snippet => {
        if (snippet._id === snippetId) {
          const upvotes = snippet.upvotes.filter(v => v.entity._id !== userId);
          const hasDownvoted = snippet.downvotes.some(v => v.entity._id === userId);
          const downvotes = hasDownvoted 
            ? snippet.downvotes 
            : [...snippet.downvotes, { entity: { _id: userId }, model: 'User' }];
            
          return {
            ...snippet,
            upvotes,
            downvotes,
            upvoteCount: upvotes.length,
            downvoteCount: downvotes.length,
            netVotes: upvotes.length - downvotes.length
          };
        }
        return snippet;
      });
      
      if (state.currentSnippet?._id === snippetId) {
        const upvotes = state.currentSnippet.upvotes.filter(v => v.entity._id !== userId);
        const hasDownvoted = state.currentSnippet.downvotes.some(v => v.entity._id === userId);
        const downvotes = hasDownvoted 
          ? state.currentSnippet.downvotes 
          : [...state.currentSnippet.downvotes, { entity: { _id: userId }, model: 'User' }];
          
        state.currentSnippet = {
          ...state.currentSnippet,
          upvotes,
          downvotes,
          upvoteCount: upvotes.length,
          downvoteCount: downvotes.length,
          netVotes: upvotes.length - downvotes.length
        };
      }
      
      state.isLoading = false;
    },
    
    // When bookmarking succeeds
    bookmarkSnippetSuccess(state, action) {
      const { snippetId, userId } = action.payload;
      
      // Similar update pattern for bookmarks
      state.snippets = state.snippets.map(snippet => {
        if (snippet._id === snippetId) {
          const isBookmarked = snippet.bookmarkedBy.some(b => b.entity._id === userId);
          const bookmarkedBy = isBookmarked
            ? snippet.bookmarkedBy.filter(b => b.entity._id !== userId)
            : [...snippet.bookmarkedBy, { entity: { _id: userId }, model: 'User' }];
            
          return {
            ...snippet,
            bookmarkedBy
          };
        }
        return snippet;
      });
      
      // Apply similar updates to trendingSnippets and currentSnippet if needed
    },
    
    // Reset current snippet when leaving detail view
    clearCurrentSnippet(state) {
      state.currentSnippet = null;
    }
  }
});

// Export actions
export const {
  loadSnippetsStart,
  loadSnippetsSuccess,
  loadTrendingSnippetsStart,
  loadTrendingSnippetsSuccess,
  loadSnippetStart,
  loadSnippetSuccess,
  snippetsFailure,
  voteSnippetStart,
  upvoteSnippetSuccess,
  downvoteSnippetSuccess,
  bookmarkSnippetSuccess,
  clearCurrentSnippet
} = snippetsSlice.actions;

// Export reducer
export default snippetsSlice.reducer;