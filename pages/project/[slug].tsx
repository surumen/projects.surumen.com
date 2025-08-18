import { GetStaticProps, GetStaticPaths } from 'next';
import { Fragment } from 'react';
import { NextSeo } from 'next-seo';

import ProjectSummary from '@/widgets/projects/ProjectSummary';
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
    programmingLanguage: project.languages,
    tool: project.frameworks,
    dateCreated: project.completed,
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
            tags: [...project.languages, ...project.frameworks],
          },
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [...project.languages, ...project.frameworks, ...project.technologyAreas].join(', '),
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
        <ProjectSummary 
          project={project} 
          blog={blog} 
          isPreview={false} 
        />
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
    if (project.hasBlog) {
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
