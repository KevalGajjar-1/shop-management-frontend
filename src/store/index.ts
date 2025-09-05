import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';

// ✅ Step 1: Create combined reducer
const appReducer = combineReducers({
  auth: authReducer,
  [ baseApi.reducerPath ]: baseApi.reducer,
});

// ✅ Step 2: Create root reducer that handles logout
const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Reset entire Redux state (including RTK Query cache)
    state = undefined;
  }

  return appReducer(state, action);
};

// ✅ Step 3: Use rootReducer instead of individual reducers
export const store = configureStore({
  reducer: rootReducer, // Changed from object to rootReducer function
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ 'persist/PERSIST', 'persist/REHYDRATE' ]
      }
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production'
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
