// app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appSlice from '@/store/appSlice';
import projectsSlice from '@/store/projectsSlice';
import fplSlice from '@/store/fplSlice';
import bracketSlice from '@/store/bracketSlice';

export const store = configureStore({
    reducer: {
        app: appSlice,
        projects: projectsSlice,
        fpl: fplSlice,
        bracket: bracketSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
