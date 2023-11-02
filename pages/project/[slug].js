import Head from 'next/head';
import { useEffect, Fragment } from 'react';

// import widget/custom components
import { ProjectSummary } from 'app/widgets';
import { useRouter } from 'next/router'

// import data files
import { AllProjectsData } from 'app/data/AllProjectsData';
import { Col, Row } from "react-bootstrap";

const ProjectSingle = () => {

    const router = useRouter();
    const slug = router.query.slug;

    const project = AllProjectsData.filter(p => p.slug === slug)[0];

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
    });

    return (
        <Fragment>
            <main className='container-fluid px-4 py-5 p-lg-6 p-xxl-8'>
                <Row>
                    <Col>
                        {project ? (
                            <ProjectSummary item={project} />
                        ) : (<span></span>)}
                    </Col>
                </Row>
            </main>
        </Fragment>
    );
}

export default ProjectSingle;
