import { createSlice } from '@reduxjs/toolkit'

// import types
import { Project } from '@/types';

// import data files
import { AllProjectsData } from '@/data/projects/AllProjectsData';


const initialState = {
    projects: AllProjectsData,
    previewedProject: null,
    filters: Array.from(new Set(AllProjectsData.map((project: Project) => project.technologyAreas).flat())),
    activeFilters: [],
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        preview: (state, action) => {
            state.previewedProject = action.payload
        },
        setFilter: (state, action) => {
            // @ts-ignore
            state.activeFilters = [...state.activeFilters, action.payload];
        },
        removeFilter: (state, action) => {
            state.activeFilters = state.activeFilters.filter(filter => filter !== action.payload);
        },
        clearFilters: (state) => {
            state.activeFilters = [];
        },
    },
})

export const {
    setFilter,
    removeFilter,
    clearFilters
} = projectsSlice.actions

export default projectsSlice.reducer
