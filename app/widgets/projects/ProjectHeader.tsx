import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';
import { Project } from '@/types';

interface ProjectHeaderProps {
  project: Project;
  isPreview?: boolean;
  free?: boolean;
  viewby?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  isPreview = true,
  free = false,
  viewby = 'stack'
}) => {
  return (
    <Row className="page-header align-items-stretch mb-0">
      <Col sm={12} md={4} className="d-flex flex-column">
        <h1 className="display-4 mb-4 fw-semibold" style={{ lineHeight: '1.5' }}>
          {project.title}
        </h1>

        <div className="d-flex gap-2 flex-wrap mt-auto mb-6">
          {project.technologyAreas.map((category, index) => (
            <span
              key={index}
              className="btn btn-sm btn-outline-info rounded-pill shadow-none"
              style={{ pointerEvents: 'none' }}
            >
              {category}
            </span>
          ))}
        </div>
      </Col>

      <Col sm={12} md={6} className="align-self-start">
        <div className="vstack gap-4 mb-5 mb-0">
          <h6 className="card-subtitle fw-normal">Project Description</h6>
          <div 
            className="article mb-0"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
      </Col>

      <Col sm={12} md={2} className="mb-5 mb-md-0">
        <div
          className="d-flex flex-wrap d-md-grid h-100"
          style={{ gridTemplateRows: 'auto auto 1fr' }}
        >
          <div className="w-50 w-md-auto" style={{ alignSelf: 'start' }}>
            <h6 className="card-subtitle fw-normal mb-2">Completed</h6>
            <p className="article text-sm">{project.completed}</p>
          </div>

          <div className="w-50 w-md-auto pt-md-4" style={{ alignSelf: 'start' }}>
            <h6 className="card-subtitle fw-normal mb-2">Collaborators</h6>
            <p className="article text-sm">Individual Project</p>
          </div>

          {isPreview && project.slug && (
            <div className="w-100 pb-md-6 pt-md-0 pt-3" style={{ alignSelf: 'end' }}>
              <a
                target="_blank"
                rel="noopener"
                href={`/project/${project.slug}`}
                className="btn btn-sm rounded-pill w-100 btn-soft-secondary"
              >
                <SendFill size={12} className="mb-1" />
                <span className="ms-2">View Project</span>
              </a>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ProjectHeader;
