import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  achievements: [],
  unlocked: [], // Changed from Set to array
  claimed: [],  // Changed from Set to array
  totalXP: 0,
  unclaimed: [],
  isLoading: false,
  error: null
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    loadAchievementsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loadAchievementsSuccess(state, action) {
      const { achievements } = action.payload;
      
      const unlocked = [];
      const claimed = [];
      const unclaimed = [];
      let totalXP = 0;
      
      achievements.forEach(a => {
        unlocked.push(a.key);
        if (a.claimed) {
          claimed.push(a.key);
          totalXP += a.xp;
        } else {
          unclaimed.push(a.key);
        }
      });
      
      state.achievements = achievements;
      state.unlocked = unlocked;
      state.claimed = claimed;
      state.totalXP = totalXP;
      state.unclaimed = unclaimed;
      state.isLoading = false;
    },
    claimAchievementSuccess(state, action) {
      const { key, xp } = action.payload;
      if (!state.claimed.includes(key)) {
        state.claimed.push(key);
        state.totalXP += xp;
        state.unclaimed = state.unclaimed.filter(k => k !== key);
      }
    },
    claimAllAchievementsSuccess(state, action) {
      const { keys, xp } = action.payload;
      keys.forEach(key => {
        if (!state.claimed.includes(key)) {
          state.claimed.push(key);
        }
      });
      state.totalXP += xp;
      state.unclaimed = [];
    },
    achievementsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  loadAchievementsStart,
  loadAchievementsSuccess,
  claimAchievementSuccess,
  claimAllAchievementsSuccess,
  achievementsFailure
} = achievementsSlice.actions;

export default achievementsSlice.reducer;