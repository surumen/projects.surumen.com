import { configureStore } from '@reduxjs/toolkit';
import appSlice from '@/store/appSlice';
import projectsSlice from '@/store/projectsSlice';
import matchMadnessBracketSlice from '@/store/marchMadnessBracketSlice';

export const store = configureStore({
  reducer: {
      app: appSlice,
      projects: projectsSlice,
      matchMadness: matchMadnessBracketSlice,
  },
})