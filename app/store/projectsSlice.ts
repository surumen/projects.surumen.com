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
    languages: Array.from(new Set(AllProjectsData.map((project: Project) => project.language).flat())),
    search: ''
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        preview: (state, action) => {
            state.previewedProject = action.payload
        },
        addFilter: (state: any, action: any) => {
            state.activeFilters = [...state.activeFilters, action.payload];
        },
        applyFilter: (state: any, action: any) => {
            if (state.activeFilters.indexOf(action.payload) === -1) {
                state.activeFilters = [...state.activeFilters, action.payload];
            } else {
                state.activeFilters = state.activeFilters.filter(filter => filter !== action.payload);
            }
        },
        setSearch: (state, action) => {
            state.search = action.payload;
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
    applyFilter,
    addFilter,
    removeFilter,
    clearFilters,
    setSearch
} = projectsSlice.actions

export default projectsSlice.reducer
