import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  isConnected: false,
  walletAddress: null,
  jwtToken: null,
  isLoading: false,
  error: null,
  userData: null,
  visitorId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // When wallet connection starts
    connectWalletStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When wallet is successfully connected
    connectWalletSuccess(state, action) {
      state.isConnected = true;
      state.walletAddress = action.payload.walletAddress;
      state.isLoading = false;
    },
    
    // When authentication with backend starts
    authenticateStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // When backend authentication succeeds
    authenticateSuccess(state, action) {
      state.jwtToken = action.payload.token;
      state.userData = action.payload.user;
      state.isLoading = false;
    },
    
    // When any auth operation fails
    authFailure(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // When user disconnects wallet
    disconnectWallet(state) {
      state.isConnected = false;
      state.walletAddress = null;
      state.jwtToken = null;
      state.userData = null;
    },
    
    // To update user data
    updateUserData(state, action) {      
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },

    setVisitorId(state, action) {
      if(state.userData?._id) {
        state.visitorId = state.userData._id;
      } else if (!state.visitorId) {
        state.visitorId = `vis-${uuidv4().replace(/-/g, '')}` // Generate a new visitor ID if not authenticated
      }
    },
  }
});

// Export actions
export const { 
  connectWalletStart,
  connectWalletSuccess,
  authenticateStart,
  authenticateSuccess,
  authFailure,
  disconnectWallet,
  updateUserData,
  setVisitorId,
  markProfilePromptShown
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;