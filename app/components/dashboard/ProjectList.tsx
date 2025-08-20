import React from 'react';
import { Col, Row, Nav } from 'react-bootstrap';
import { SendFill, Heart } from 'react-bootstrap-icons';
import { Project } from '@/types';
import { LanguageColorMap } from '@/data/colorMap';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  hasActiveFiltersOrSearch: boolean;
  search: string;
  activeFilters: string[];
  onClearFilters: () => void;
  onClearSearch: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onProjectClick,
  hasActiveFiltersOrSearch,
  search,
  activeFilters,
  onClearFilters,
  onClearSearch
}) => {

  const getLanguageScheme = (language: string) => {
    const colorMap = LanguageColorMap.find(map => map.color === language);
    return colorMap?.scheme || 'primary';
  };

  if (projects.length === 0) {
    return null; // Dashboard handles empty state messaging
  }

  return (
    <div className="projects-list">
      {projects.map((project, index) => (
        <Nav.Link 
          key={project.id || index}
          className="card card-hover shadow-none rounded border-0 border-bottom card-dotted mb-0"
          onClick={() => onProjectClick(project)}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-body">
            <div className="d-flex align-items-md-center">
              <div className="flex-shrink-0">
                <div className="icon icon-shape rounded-circle flex-none text-base bg-body-tertiary text-bg-body-secondary">
                  <SendFill size={16} />
                </div>
              </div>

              <div className="flex-grow-1 ms-5">
                <div className="row align-items-md-center justify-content-between">
                  <Col sm={10} className="mb-2 mb-md-0">
                    <h4 className="mb-2 fw-semibold">{project.title}</h4>
                    <p className="text-muted">{project.shortDescription}</p>
                    
                    <div className="row fs-6 text-body gap-2">
                      {project.frameworks.map((framework, index) => (
                        <div key={index} className="col-auto">
                          <span className={`legend-indicator bg-accent-${getLanguageScheme(framework)}`} />
                          {framework}
                        </div>
                      ))}
                    </div>
                  </Col>
                  
                  <Col sm={3} className="col-md-auto order-md-last text-md-end text-center ms-n3">
                    <button className="btn btn-ghost-primary btn-icon btn-sm rounded-circle">
                      <Heart size={16} />
                    </button>
                  </Col>
                </div>
              </div>
            </div>
          </div>
        </Nav.Link>
      ))}
    </div>
  );
};

export default ProjectList;