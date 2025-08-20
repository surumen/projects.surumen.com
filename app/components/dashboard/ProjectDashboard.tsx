'use client';

import React, { useState } from 'react';
import { Col, Container, Navbar, Offcanvas, Row } from 'react-bootstrap';
import { Search, X, XLg } from 'react-bootstrap-icons';
import useProjects from '@/hooks/useProjects';
import { useProjectsStore } from '@/store/store';
import { Project } from '@/types';
import ProjectList from './ProjectList';
import ProjectPreview from '@/widgets/projects/ProjectPreview';
import LogoIcon from '@/widgets/components/LogoIcon';
import QuickMenu from '@/widgets/navbars/QuickMenu';

// Removed DefaultLayout import - layout should only be at app level

interface ProjectDashboardProps {
  className?: string;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  className = "" 
}) => {
  const { projects, filters, activeFilters, search, totalProjects, filteredCount } = useProjects();
  const { toggleFilter, clearFilters, setSearch } = useProjectsStore();
  
  // Offcanvas state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Apply active filters to projects
  const finalFilteredProjects = activeFilters.length === 0 
    ? projects
    : projects.filter(project => 
        project.technologyAreas.some(area => activeFilters.includes(area))
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

  // Search component for navbar
  const navbarSearch = (
    <div className='d-none d-md-block'>
      <div className='input-group input-group-merge input-group-borderless navbar-input-group rounded'>
        <div className='input-group-prepend input-group-text'>
          <Search size={12} className='me-1'/>
        </div>
        <input 
          type='search' 
          className='form-control focus rounded' 
          placeholder='Search projects, technologies, descriptions...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="input-group-append input-group-text"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <XLg size={12} />
          </button>
        )}
      </div>
    </div>
  );

  return (
      <>
        {/* Top Navigation Bar */}
        <Navbar className='navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-body'>
          <div className='navbar-nav-wrap'>
            <Navbar.Brand href="/" className='navbar-brand d-none'>
              <LogoIcon primary={'#377dff'} dark={'#1c232c'} />
            </Navbar.Brand>

            <div className='navbar-nav-wrap-content-start'>
              {navbarSearch}
            </div>

            <div className='navbar-nav-wrap-content-end'>
              <ul className='navbar-nav'>
                <QuickMenu />
              </ul>
            </div>
          </div>
        </Navbar>

        <div className='main'>
          <div className='content container-fluid'>
            <Container fluid className={className}>
              {/* Combined Header and Filters Section */}
              <Row className="mb-4">
                <Col>
                  {/* Dynamic content: Search results or Filters */}
                  {search ? (
                    // Search Results Summary
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {finalFilteredProjects.length > 0 ? (
                          <p className="text-muted mb-0">
                            Showing {finalFilteredProjects.length} of {totalProjects} projects for "{search}"
                            {activeFilters.length > 0 && (
                              <span> with {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied</span>
                            )}
                          </p>
                        ) : (
                          <div>
                            <p className="text-muted mb-2">
                              No projects found for "{search}"
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
                </Col>
              </Row>

              {/* Projects List */}
              <Row>
                <Col>
                  <ProjectList
                      projects={finalFilteredProjects}
                      onProjectClick={handleProjectClick}
                      hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
                      search={search}
                      activeFilters={activeFilters}
                      onClearFilters={clearFilters}
                      onClearSearch={handleClearSearch}
                  />
                </Col>
              </Row>
            </Container>
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
                className="btn d-inline-flex btn-sm btn-neutral shadow-none rounded-pill"
            >
              <span>Back to Projects</span>
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