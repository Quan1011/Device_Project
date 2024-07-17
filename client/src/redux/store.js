import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import globalReducer from "./index"
import { api } from "./api";

// Define persistence configuration
const persistConfig = {
  key: 'root',
  storage, // Replace with your chosen storage (e.g., localStorage, sessionStorage)
  version: 1,
};

// Combine reducers, including persistedReducer
const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer),
  global: globalReducer,
  [api.reducerPath]: api.reducer, // Add the API reducer
});

// Create the Redux store with combined reducers and middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware), // Add API middleware
});

// Persist the store (optional)
const persistor = persistStore(store);

export { store, persistor }; // Export both store and persistor if needed