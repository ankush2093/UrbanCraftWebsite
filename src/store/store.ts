import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';

// Import all API slices to ensure they're registered with baseApi
import './api/auth';
import './api/contactus';
import './api/marketplace';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

