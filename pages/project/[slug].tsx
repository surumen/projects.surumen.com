import Head from 'next/head';
import { useEffect, Fragment } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// import lib/widget/custom components
import { getProjectBySlug, getAllProjects, getProjectBlogBySlug } from '../../lib/getProjectBySlug';
import { Project } from "@/types";
import { NextSeo } from "next-seo";


const ProjectSingle = ({project, blog}) => {

    const router = useRouter();

    if (!router.isFallback && !project?.slug) {

    }

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
    });

    const ProjectSummary = dynamic(() => import('@/widgets/projects/ProjectSummary'), {
        ssr: false,
    });

    return (
        <Fragment>
            <NextSeo
                title={project.title}
                description={project.description}
                openGraph={{
                    title: project.title,
                    description: project.description,
                    site_name: process.env.siteName,
                }}
            />
            <main className='container-fluid py-5'>
                {project ? (
                    <ProjectSummary project={project} blog={blog} isPreview={false} />
                ) : (<span></span>)}
            </main>
        </Fragment>
    );
}

ProjectSingle.propTypes = {
    project: PropTypes.object,
    blog: PropTypes.string
}

export default ProjectSingle;


export const getStaticProps = async ({ params, previewData = {} }) => {

    const project: Project = getProjectBySlug(params.slug);
    let blog = '';
    if (project.contentType === 'blog') {
        blog = getProjectBlogBySlug(params.slug);
    }

    return {
        props: {
            project: project,
            blog: blog,
            key: params.slug,
        },
        revalidate: 60,
    };
};

export async function getStaticPaths() {
    const projects = getAllProjects();
    return {
        paths: projects.map((project) => {
            return {
                params: {
                    slug: project.slug
                },
            }
        }),
        fallback: false,
    }
}
