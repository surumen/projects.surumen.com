import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Container, Row, Col } from 'react-bootstrap';

import { ProjectHeader } from '@/widgets';
import Markdown from '../../app/widgets/projects/Markdown';
import { useCMSStore } from '@/store/cmsStore';

export default function ProjectPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { projects, fetchProjects, loading, error } = useCMSStore();

  // Find project in store by slug (only published, non-archived)
  const project = projects.find(p =>
    p.slug === slug && p.published && p.archived !== true
  );

  // Load projects if store is empty
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [fetchProjects, projects.length]);

  // Loading state
  if (loading) {
    return (
      <main className="container-fluid py-5">
        <Container>
          <Row>
            <Col>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading project...</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container-fluid py-5">
        <Container>
          <Row>
            <Col>
              <div className="alert alert-danger text-center">
                <h4>Error loading project</h4>
                <p>{error}</p>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => fetchProjects()}
                >
                  Try Again
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  // Project not found
  if (!project && !loading) {
    return (
      <main className="container-fluid py-5">
        <Container>
          <Row>
            <Col>
              <div className="text-center">
                <h1 className="display-4 text-muted">404</h1>
                <h4>Project not found</h4>
                <p className="text-muted">
                  The project "{slug}" could not be found or is not published.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/')}
                >
                  Back to Projects
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  // Project found - render content
  if (!project) return null; // Shouldn't reach here, but TypeScript safety

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    author: {
      '@type': 'Person',
      name: 'Moses Surumen',
    },
    programmingLanguage: project.technologies,
    tool: project.technologies,
    dateCreated: project.year,
  };

  return (
    <Fragment>
      <NextSeo
        title={`${project.title} | Moses Surumen`}
        description={project.shortDescription}
        canonical={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://projects.surumen.com'}/project/${project.slug}`}
        openGraph={{
          title: project.title,
          description: project.shortDescription,
          type: 'article',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://projects.surumen.com'}/project/${project.slug}`,
          siteName: 'Moses Surumen Projects',
          article: {
            authors: ['Moses Surumen'],
            tags: project.technologies,
          },
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: project.technologies.join(', '),
          },
          {
            name: 'author',
            content: 'Moses Surumen',
          },
        ]}
      />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="container-fluid py-5">
        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Project Content */}
        {project.blog ? (
          <Container className="mw-screen-xxl py-5">
            <Row>
              <Col>
                <article className="article">
                  <div className="text-center text-muted">
                    <h4>Project Documentation</h4>
                    <p>Blog content integration coming soon...</p>
                    <p>Check back later for technical details and insights.</p>
                  </div>
                </article>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container className="py-5">
            <Row>
              <Col>
                <div className="text-center text-muted">
                  <h4>Project Documentation</h4>
                  <p>Detailed documentation for this project is coming soon.</p>
                  <p>Check back later for technical details, implementation notes, and insights.</p>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </main>
    </Fragment>
  );
}
