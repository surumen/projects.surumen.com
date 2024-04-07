// import node module libraries
import { useSelector } from 'react-redux'

const useProjects = () => {
    const projects = useSelector((state: any) => state.projects.projects);
    const filters = useSelector((state: any) => state.projects.filters);
    const activeFilters = useSelector((state: any) => state.projects.activeFilters);

    return {
        projects,
        filters,
        activeFilters,
    };
};

export default useProjects;
