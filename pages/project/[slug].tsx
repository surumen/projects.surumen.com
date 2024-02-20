import Head from 'next/head';
import { useEffect, Fragment } from 'react';
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Col, Row } from 'react-bootstrap';

// import lib/widget/custom components
import { getProjectBySlug, getAllProjects } from '../../lib/getProjectBySlug';
import markdownToHtml from '../../lib/markdownToHtml';


const ProjectSingle = ({project}) => {

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
            <main className='container-fluid py-5'>
                {project ? (
                    <ProjectSummary item={project} />
                ) : (<span></span>)}
            </main>
        </Fragment>
    );
}

ProjectSingle.propTypes = {
    project: PropTypes.object
}

export default ProjectSingle;

type Params = {
    params: {
        slug: string
    }
}

export const getStaticProps = async ({ params, previewData = {} }) => {

    const project = getProjectBySlug(params.slug);
    const content =  await markdownToHtml(project.content || '')

    const data = {
        ...project,
        content,
    };

    return {
        props: {
            project: data,
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
