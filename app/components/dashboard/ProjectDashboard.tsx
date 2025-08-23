'use client';

import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { ChevronLeft, X } from 'react-bootstrap-icons';
import useProjects from '@/hooks/useProjects';
import { useProjectsStore } from '@/store/store';
import { Project } from '@/types';
import ProjectList from './ProjectList';
import ProjectPreview from '@/widgets/projects/ProjectPreview';

interface ProjectDashboardProps {
  // No props needed - layout handles container
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = () => {
  const { projects, filters, activeFilters, search, totalProjects, filteredCount } = useProjects();
  const { toggleFilter, clearFilters, setSearch } = useProjectsStore();
  
  // Offcanvas state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Apply active filters to projects
  const finalFilteredProjects = activeFilters.length === 0 
    ? projects
    : projects.filter(project => 
        project.technologies.some(tech => activeFilters.includes(tech))
      );

  const hasActiveFiltersOrSearch = activeFilters.length > 0 || search.length > 0;

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedProject(null);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const isFilterSelected = (filter: string) => activeFilters.includes(filter);

  // Generate random suggestions from available filters
  const getRandomSuggestions = (count = 3) => {
    const shuffled = [...filters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header border-bottom-0 mb-0">
            <div className="row align-items-center">
              <div className="col">
                {/* Filters Section */}
                {search ? (
                  // Search Results Summary
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {finalFilteredProjects.length > 0 ? (
                        <p className="text-muted mb-0">
                          Showing {finalFilteredProjects.length} of {totalProjects} projects for &ldquo;{search}&rdquo;
                          {activeFilters.length > 0 && (
                            <span> with {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied</span>
                          )}
                        </p>
                      ) : (
                        <div>
                          <p className="text-muted mb-2">
                            No projects found for &ldquo;{search}&rdquo;
                            {activeFilters.length > 0 && <span> with current filters</span>}
                          </p>
                          <small className="text-muted">
                            Try searching for technologies like {getRandomSuggestions().map((tech, index, array) => (
                              <span key={tech}>
                                <button 
                                  onClick={() => setSearch(tech)}
                                  className="btn btn-link btn-sm p-0 text-decoration-underline"
                                  style={{ fontSize: 'inherit' }}
                                >
                                  {tech}
                                </button>
                                {index < array.length - 1 ? ', ' : ''}
                              </span>
                            ))} or browsing all projects.
                          </small>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        clearFilters();
                        setSearch('');
                      }}
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                    >
                      <X size={14} className="me-1" />
                      Clear Search
                    </button>
                  </div>
                ) : (
                  // Filter Pills (when no search)
                  <div className="row align-items-center overflow-x-auto g-6 m-0">
                    <ul className="row list-unstyled flex-nowrap" style={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      overflowX: 'auto',
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}>
                      {filters.map((filter) => (
                        <li key={filter} className="col-auto">
                          <button
                            onClick={() => toggleFilter(filter)}
                            className={`btn btn-sm rounded-pill shadow-none ${
                              isFilterSelected(filter)
                                ? 'btn-primary border-primary'
                                : 'btn-outline-primary'
                            }`}
                          >
                            {filter}
                            {isFilterSelected(filter) && (
                              <X size={14} className="ms-2 me-n1" />
                            )}
                          </button>
                        </li>
                      ))}

                      <li className="col-auto">
                        <button
                          onClick={clearFilters}
                          disabled={activeFilters.length === 0}
                          className="btn btn-sm btn-light border rounded-pill"
                        >
                          <X size={14} className="me-1" />
                          <span>Clear Filters</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End Page Header */}

          {/* Projects List */}
          <div className="row">
            <ProjectList
                projects={finalFilteredProjects}
                onProjectClick={handleProjectClick}
                hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
                search={search}
                activeFilters={activeFilters}
                onClearFilters={clearFilters}
                onClearSearch={handleClearSearch}
            />
          </div>
        </div>

        {/* Project Preview Offcanvas */}
        <Offcanvas
            show={showPreview}
            className="border-0"
            onHide={handleClosePreview}
            placement="end"
            style={{ width: 'calc(100vw - 7.5rem)' }}
        >
          <Offcanvas.Header className="justify-content-end border-bottom">
            <button
                onClick={handleClosePreview}
                className="btn btn-ghost-secondary btn-icon border rounded-circle"
            >
              <ChevronLeft size={16} />
            </button>
          </Offcanvas.Header>

          <Offcanvas.Body>
            {selectedProject && (
                <ProjectPreview project={selectedProject} />
            )}
          </Offcanvas.Body>
        </Offcanvas>
    </>
  );
};