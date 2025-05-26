// src/lib/redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    loadNotificationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadNotificationsSuccess(state, action) {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
      state.loading = false;
    },
    loadNotificationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    markAllAsRead(state) {
      state.notifications = state.notifications.map(n => ({
        ...n,
        isRead: true
      }));
      state.unreadCount = 0;
    },
    deleteNotificationSuccess(state, action) {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    }
  }
});

export const {
  loadNotificationsStart,
  loadNotificationsSuccess,
  loadNotificationsFailure,
  markAllAsRead,
  deleteNotificationSuccess
} = notificationSlice.actions;

export default notificationSlice.reducer;
