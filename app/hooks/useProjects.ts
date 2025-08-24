import { useEffect } from 'react';
import { useProjectsStore } from '@/store/store';
import { useCMSStore } from '@/store/cmsStore';

const useProjects = () => {
  const { activeFilters, search } = useProjectsStore();
  const { projects: allProjects, loading, error, fetchProjects } = useCMSStore();
  
  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Filter to only published, non-archived projects for public dashboard
  const projects = allProjects.filter(
    project => project.published === true && project.archived !== true
  );
  
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
    // State from CMS store
    loading,
    error,
    // Computed values
    totalProjects: projects.length,
    filteredCount: searchFilteredProjects.length
  };
};

export default useProjects;