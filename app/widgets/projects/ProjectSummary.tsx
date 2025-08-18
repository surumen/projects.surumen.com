import React, { Fragment, Suspense, useState, useEffect } from 'react';
import { Col, Row, Button, Alert } from 'react-bootstrap';
import { PlayCircle, Code } from 'react-bootstrap-icons';
import dynamic from 'next/dynamic';

import MarkdownDisplay from './Markdown';
import ProjectHeader from './ProjectHeader';
import { Project } from '@/types';

interface ProjectSummaryProps {
  project: Project;
  blog: string | null;
  isPreview: boolean;
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

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ project, blog, isPreview }) => {
  const [showDemo, setShowDemo] = useState(true);
  const [demoError, setDemoError] = useState<Error | null>(null);
  const [navContent, setNavContent] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate navigation from blog headings (client-side only to prevent hydration issues)
  useEffect(() => {
    if (isMounted && blog && project.hasBlog) {
      try {
        const headings = blog.match(/#{1,2}.+/g) || [];
        const processedNavContent: string[] = [];
        
        headings.forEach(header => {
          const numHashes = (header.match(/#/g) || []).length;
          if (numHashes > 0 && numHashes < 3) {
            processedNavContent.push(header.replace(/#/g, '').trim());
          }
        });
        
        setNavContent(processedNavContent);
      } catch (error) {
        setNavContent([]);
      }
    }
  }, [isMounted, blog, project.hasBlog]);

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

  const handleScrollToArticle = () => {
    const article = document.querySelector('.article');
    if (article) {
      article.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Don't render navigation on server to prevent hydration mismatch
  const shouldShowNavigation = isMounted && navContent.length > 0;

  return (
    <Fragment>
      <ProjectHeader project={project} isPreview={isPreview} />

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
                    {project.hasBlog && (
                      <Button 
                        variant="outline-secondary"
                        onClick={handleScrollToArticle}
                      >
                        <Code size={16} className="me-1" />
                        Read Documentation
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

      {/* Blog Content Section */}
      {!isPreview && project.hasBlog && blog ? (
          <section className="container mw-screen-xxl py-5 m-5">
            <Row className="pt-4">
              {shouldShowNavigation && (
                  <Col md={3}>
                    <nav className="position-lg-sticky top-lg-6" style={{ top: '2rem' }}>
                      <h6 className="text-muted text-uppercase mb-3">Contents</h6>
                      <ul className="nav flex-column">
                        {navContent.map((navigation, index) => (
                            <li key={index} className="nav-item">
                              <a
                                  className="nav-link px-0 text-decoration-none"
                                  href={`#${navigation.replace(/ /g, '-').toLowerCase()}`}
                              >
                                {navigation}
                              </a>
                            </li>
                        ))}
                      </ul>
                    </nav>
                  </Col>
              )}
              <Col md={shouldShowNavigation ? 9 : 12}>
                <article className="article">
                  <MarkdownDisplay content={blog} />
                </article>
              </Col>
            </Row>
          </section>
      ) : null}

      {/* Empty State */}
      {!project.hasBlog && !project.hasDemo && (
        <div className="container py-5">
          <div className="text-center text-muted">
            <p>This project is still being documented.</p>
            <p>Check back soon for more details!</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProjectSummary;
