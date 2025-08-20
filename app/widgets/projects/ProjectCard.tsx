import React, { useState } from 'react';
import { Offcanvas, Button, Col, Nav } from 'react-bootstrap';
import { SendFill, Heart } from 'react-bootstrap-icons';
import { useMediaQuery } from 'react-responsive';
import useMounted from '@/hooks/useMounted';
import ProjectSummary from './ProjectSummary';
import { LanguageColorMap } from '@/data/colorMap';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  viewby?: string;
  free?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  viewby = 'stack', 
  free = false 
}) => {
  const [show, setShow] = useState(false);
  const hasMounted = useMounted();
  const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
  const isMobile = hasMounted && isMobileQuery;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getLanguageScheme = (language: string) => {
    const colorMap = LanguageColorMap.find(map => map.color === language);
    return colorMap?.scheme || 'primary';
  };

  const offcanvasWidth = isMobile ? '100vw' : 'calc(100vw - 7.5rem)';

  return (
    <>
      <Nav.Link className="card card-hover shadow-none rounded border-0 border-bottom card-dotted mb-0">
        <div className="card-body">
          <div className="d-flex align-items-md-center">
            <div onClick={handleShow} className="flex-shrink-0 cursor-pointer">
              <div className="icon icon-shape rounded-circle flex-none text-base bg-body-tertiary text-bg-body-secondary">
                <SendFill size={16} />
              </div>
            </div>

            <div className="flex-grow-1 ms-5">
              <div className="row align-items-md-center justify-content-between">
                <Col 
                  onClick={handleShow} 
                  sm={10} 
                  className="mb-2 mb-md-0 cursor-pointer"
                >
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

      <Offcanvas 
        show={show}
        className="border-0"
        onHide={handleClose}
        placement="end"
        style={{ width: offcanvasWidth }}
      >
        <Offcanvas.Header className="justify-content-end border-bottom">
          <Button 
            onClick={handleClose} 
            className="btn d-inline-flex btn-sm btn-neutral shadow-none rounded-pill"
          >
            <span>Back Home</span>
          </Button>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          <ProjectSummary project={project} blog={null} isPreview={true} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ProjectCard;
