import { useProjectsStore } from '@/store/store';
import { AllProjectsData } from '@/data/projects/AllProjectsData';

const useProjects = () => {
  const { activeFilters, search } = useProjectsStore();
  
  // Get static project data
  const projects = AllProjectsData;
  
  // Extract unique technologies for filtering
  const allTechnologies = projects.flatMap(p => p.technologies || []);
  
  const filters = [...new Set(allTechnologies)].sort();

  // Apply search filter if search term exists
  const searchFilteredProjects = search 
    ? projects.filter(project => 
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : projects;

  return {
    projects: searchFilteredProjects,
    filters,
    activeFilters,
    search,
    // Computed values
    totalProjects: projects.length,
    filteredCount: searchFilteredProjects.length
  };
};

export default useProjects;