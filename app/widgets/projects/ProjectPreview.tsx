import React, { Fragment, Suspense, useState, useEffect } from 'react';
import { Col, Row, Button, Alert } from 'react-bootstrap';
import { PlayCircle, Code, SendFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProjectHeader from './ProjectHeader';
import { Project } from '@/types';

interface ProjectPreviewProps {
  project: Project;
}

// Error Boundary for Demo Components
const DemoErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <Alert variant="warning" className="my-5">
    <Alert.Heading>Demo Unavailable</Alert.Heading>
    <p>Sorry, there was an issue loading the interactive demo.</p>
    <div className="d-flex gap-2">
      <Button variant="outline-warning" size="sm" onClick={retry}>
        Try Again
      </Button>
    </div>
  </Alert>
);

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project }) => {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(true);
  const [demoError, setDemoError] = useState<Error | null>(null);

  // Get the demo component using truly dynamic import
  const getDemoComponent = () => {
    if (!project.hasDemo || !showDemo || !project.slug) return null;

    const DemoComponent = dynamic(
      () => import(`@/components/demos/${project.slug}`),
      {
        ssr: false,
        loading: () => (
          <div className="demo-skeleton">
            <div className="container border rounded py-5 my-5 bg-body-tertiary">
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading demo...</span>
                </div>
                <p className="text-muted">Loading interactive demo...</p>
              </div>
            </div>
          </div>
        )
      }
    );

    return (
      <Suspense fallback={
        <div className="demo-skeleton">
          <div className="container border rounded py-5 my-5 bg-body-tertiary">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading demo...</span>
              </div>
              <p className="text-muted">Loading interactive demo...</p>
            </div>
          </div>
        </div>
      }>
        <DemoComponent />
      </Suspense>
    );
  };

  const handleDemoLoad = () => {
    setDemoError(null);
    setShowDemo(true);
  };

  const handleDemoRetry = () => {
    setDemoError(null);
    setShowDemo(false);
    // Trigger re-load
    setTimeout(() => setShowDemo(true), 100);
  };

  const handleViewFullProject = () => {
    if (project.slug) {
      router.push(`/project/${project.slug}`);
    }
  };

  return (
    <Fragment>
      <ProjectHeader project={project} isPreview={true} />

      {/* Interactive Demo Section */}
      {project.hasDemo && (
        <section className="demo-section">
          {!showDemo ? (
            <div className="container border rounded py-5 my-5 bg-light text-center">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <PlayCircle size={48} className="text-primary mb-3" />
                  <h4 className="mb-3">Interactive Demo Available</h4>
                  <p className="text-muted mb-4">
                    Experience the full functionality of {project.title} with our interactive demo.
                  </p>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleDemoLoad}
                      className="d-flex align-items-center gap-2"
                    >
                      <PlayCircle size={20} />
                      Launch Demo
                    </Button>
                    {project.slug && (
                      <Button 
                        variant="outline-secondary"
                        onClick={handleViewFullProject}
                      >
                        <Code size={16} className="me-1" />
                        View Full Project
                      </Button>
                    )}
                  </div>
                  <small className="text-muted d-block mt-3">
                    Built with {project.frameworks.slice(0, 3).join(', ')}
                    {project.frameworks.length > 3 && ` +${project.frameworks.length - 3} more`}
                  </small>
                </div>
              </div>
            </div>
          ) : demoError ? (
            <DemoErrorFallback error={demoError} retry={handleDemoRetry} />
          ) : (
            <div className="demo-container">
              {getDemoComponent()}
            </div>
          )}
        </section>
      )}

      {/* No Demo State */}
      {!project.hasDemo && (
        <div className="container py-5">
          <div className="text-center text-muted">
            <p>Interactive demo coming soon for this project.</p>
            {project.slug && (
              <Button 
                variant="outline-primary"
                onClick={handleViewFullProject}
                className="mt-3"
              >
                View Project Details
              </Button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProjectPreview;