import { GetStaticProps, GetStaticPaths } from 'next';
import { Fragment } from 'react';
import { NextSeo } from 'next-seo';
import { Container, Row, Col } from 'react-bootstrap';

import { ProjectHeader, Markdown } from '@/widgets';
import { getAllProjects, getProjectBySlug, getProjectBlogBySlug } from '../../lib/getProjectBySlug';
import { Project } from '@/types';

interface ProjectPageProps {
  project: Project;
  blog: string | null;
}

export default function ProjectPage({ project, blog }: ProjectPageProps) {
  // Generate structured data for better SEO
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
        {blog && project.blog ? (
          <Container className="mw-screen-xxl py-5">
            <Row>
              <Col>
                <article className="article">
                  <Markdown content={blog} />
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

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const project = getProjectBySlug(slug);

    if (!project) {
      return {
        notFound: true,
      };
    }

    let blog: string | null = null;

    // Only load blog content if the project has blog enabled
    if (project.blog) {
      try {
        blog = getProjectBlogBySlug(slug);
        // Handle empty blog content gracefully
        if (!blog || blog.trim().length === 0) {
          blog = null;
        }
      } catch (error) {
        // Don't fail the entire page if blog loading fails
        blog = null;
      }
    }

    return {
      props: {
        project,
        blog,
      },
      revalidate: 60, // Revalidate every minute for content updates
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const projects = getAllProjects();

    const paths = projects
      .filter(project => project.slug) // Only include projects with valid slugs
      .map(project => ({
        params: { 
          slug: project.slug 
        },
      }));

    return {
      paths,
      fallback: false, // Return 404 for unknown slugs
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
};