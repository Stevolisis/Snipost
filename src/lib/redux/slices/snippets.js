import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snippets: [],
  trendingSnippets: [],
  isLoading: false,
  error: null,
  snippet: null
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
      state.snippet = action.payload;
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
            
    upvoteSnippetSuccess(state, action) {
      const { snippetId, userId } = action.payload;
      
      const updateSnippet = (snippet) => {
        if (snippet._id === snippetId) {
          // Check if user already upvoted
          const alreadyUpvoted = snippet.upvotes.some(v => v.entity === userId);
          
          // If already upvoted, remove the upvote (toggle off)
          if (alreadyUpvoted) {
            const upvotes = snippet.upvotes.filter(v => v.entity !== userId);
            return {
              ...snippet,
              upvotes,
              upvoteCount: upvotes.length,
              netVotes: upvotes.length - snippet.downvotes.length
            };
          }
          
          // If not upvoted, add upvote and remove any downvote
          const upvotes = [...snippet.upvotes, { entity: userId, model: 'User' }];
          const downvotes = snippet.downvotes.filter(v => v.entity !== userId);
          
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
      };

      state.snippets = state.snippets.map(updateSnippet);
      state.trendingSnippets = state.trendingSnippets.map(updateSnippet);
      
      if (state.snippet?._id === snippetId) {
        state.currentSnippet = updateSnippet(state.currentSnippet);
      }
    },

    downvoteSnippetSuccess(state, action) {
      const { snippetId, userId } = action.payload;
      
      const updateSnippet = (snippet) => {
        if (snippet._id === snippetId) {
          // Check if user already downvoted
          const alreadyDownvoted = snippet.downvotes.some(v => v.entity === userId);
          
          // If already downvoted, remove the downvote (toggle off)
          if (alreadyDownvoted) {
            const downvotes = snippet.downvotes.filter(v => v.entity !== userId);
            return {
              ...snippet,
              downvotes,
              downvoteCount: downvotes.length,
              netVotes: snippet.upvotes.length - downvotes.length
            };
          }
          
          // If not downvoted, add downvote and remove any upvote
          const downvotes = [...snippet.downvotes, { entity: userId, model: 'User' }];
          const upvotes = snippet.upvotes.filter(v => v.entity !== userId);
          
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
      };

      state.snippets = state.snippets.map(updateSnippet);
      state.trendingSnippets = state.trendingSnippets.map(updateSnippet);
      
      if (state.currentSnippet?._id === snippetId) {
        state.currentSnippet = updateSnippet(state.currentSnippet);
      }
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