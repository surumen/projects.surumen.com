import { configureStore } from '@reduxjs/toolkit';
import appSlice from '@/store/appSlice';
import projectsSlice from '@/store/projectsSlice';
import marchMadnessSlice from '@/store/marchMadnessSlice';
import fplSlice from '@/store/fplSlice';

export const store = configureStore({
  reducer: {
      app: appSlice,
      projects: projectsSlice,
      marchMadness: marchMadnessSlice,
      fpl: fplSlice
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;