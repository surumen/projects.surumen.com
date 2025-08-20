import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ProjectCard from './ProjectCard';
import useProjects from '@/hooks/useProjects';
import { ProjectFilters, Pagination } from '@/widgets';

const ProjectGridView: React.FC = () => {
  const { projects, activeFilters } = useProjects();
  const [page, setPage] = useState(1);
  const totalPages = 5;

  // Filter projects based on active filters
  const filteredProjects = activeFilters.length === 0 
    ? projects
    : projects.filter(project => 
        project.technologyAreas.some(area => activeFilters.includes(area))
      );

  return (
    <>
      <ProjectFilters />
      
      <Row>
        <Col className="ps-0">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} />
            ))
          ) : (
            <div className="text-center py-5">
              <span className="text-muted">No matching projects found.</span>
            </div>
          )}
        </Col>
      </Row>
      
      {filteredProjects.length > 0 && (
        <Row className="justify-content-center">
          <Col className="ps-0">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="justify-content-center mt-4"
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProjectGridView;
