import { GetStaticProps, GetStaticPaths } from 'next';
import { Fragment } from 'react';
import { NextSeo } from 'next-seo';
import { Container, Row, Col } from 'react-bootstrap';

import { ProjectHeader } from '@/widgets';
import Markdown from '../../app/widgets/projects/Markdown';
import { getAllProjects, getProjectBySlug, getProjectBlogBySlug } from '../../lib/getProjectBySlug';
import type { Project } from '../../app/types';

type SerializedProject = Omit<Project, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface ProjectPageProps {
  project: SerializedProject;
  blog: string | null;
}

export default function ProjectPage({ project, blog }: ProjectPageProps) {
  // Convert string dates back to Date objects for component usage
  const projectWithDates: Project = {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };

  // Generate structured data for better SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectWithDates.title,
    description: projectWithDates.shortDescription,
    author: {
      '@type': 'Person',
      name: 'Moses Surumen',
    },
    programmingLanguage: projectWithDates.technologies,
    tool: projectWithDates.technologies,
    dateCreated: projectWithDates.year,
  };

  return (
    <Fragment>
      <NextSeo
        title={`${projectWithDates.title} | Moses Surumen`}
        description={projectWithDates.shortDescription}
        canonical={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://projects.surumen.com'}/project/${projectWithDates.slug}`}
        openGraph={{
          title: projectWithDates.title,
          description: projectWithDates.shortDescription,
          type: 'article',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://projects.surumen.com'}/project/${projectWithDates.slug}`,
          siteName: 'Moses Surumen Projects',
          article: {
            authors: ['Moses Surumen'],
            tags: projectWithDates.technologies,
          },
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: projectWithDates.technologies.join(', '),
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
        <ProjectHeader project={projectWithDates} />

        {/* Project Content */}
        {blog ? (
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

    // Check if project has blog content
    if (project.blog) {
      try {
        blog = await getProjectBlogBySlug(slug);
        // Handle empty blog content gracefully
        if (!blog || blog.trim().length === 0) {
          blog = null;
        }
      } catch (error) {
        // Don't fail the entire page if blog loading fails
        console.error('Failed to load blog content:', error);
        blog = null;
      }
    }

    return {
      props: {
        project: {
          ...project,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
        },
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