import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import auth from './slices/auth';
import snippets from './slices/snippets';
import comments from './slices/comments';
import profile from './slices/profile';
import search from './slices/search';
import fork from './slices/fork';
import notifications from './slices/notifications';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ["auth"],
}

const combinedReducers = combineReducers({
  auth,
  snippets,
  comments,
  profile,
  search,
  fork,
  notifications,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  })
});
