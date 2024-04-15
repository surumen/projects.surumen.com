// import node module libraries
import { useSelector } from 'react-redux'

const useProjects = () => {
    const projects = useSelector((state: any) => state.projects.projects);
    const languages = useSelector((state: any) => state.projects.languages);
    const filters = useSelector((state: any) => state.projects.filters);
    const activeFilters = useSelector((state: any) => state.projects.activeFilters);
    const search = useSelector((state: any) => state.projects.search);

    return {
        projects,
        languages,
        filters,
        activeFilters,
        search
    };
};

export default useProjects;
