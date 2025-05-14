// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

// import bootstrap icons
import { SendFill, Pin, Heart, HeartFill, PinFill, StarFill } from 'react-bootstrap-icons';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';



const ProjectHeader = ({ project, isPreview }) => {

    const hasMounted    = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile      = hasMounted && isMobileQuery;

    return (
        <Fragment>
                <Row className={`page-header align-items-stretch mb-0`}>
                    <Col sm={12} md={4} className="d-flex flex-column">
                        <h1 className="display-4 mb-4 fw-semibold" style={{ lineHeight: '1.5' }}>
                            {project.title}
                        </h1>

                        <div className="d-flex gap-2 flex-wrap mt-auto mb-6">
                            {project.technologyAreas.map((category, index) => (
                                <span
                                    key={index}
                                    className="btn btn-sm btn-outline-info rounded-pill shadow-none"
                                    style={{ pointerEvents: 'none' }}
                                >
							{category}
						  	</span>
                            ))}
                        </div>
                    </Col>

                    <Col sm={12} md={6} className="align-self-start">
                        <div className='vstack gap-4 mb-5 mb-0'>
                            <h6 className='card-subtitle fw-normal'>Project Description</h6>
                            <p className='article mb-0'>
							<span
                                dangerouslySetInnerHTML={{
                                    __html: project.description
                                }}
                            ></span>
                            </p>
                        </div>
                    </Col>

                    <Col sm={12} md={2} className="mb-5 mb-md-0">
                        <div
                            className="d-flex flex-wrap d-md-grid"
                            style={{
                                height: '100%',
                                gridTemplateRows: 'auto auto 1fr',
                            }}
                        >
                            <div
                                className="w-50 w-md-auto"
                                style={{ alignSelf: 'start' }}
                            >
                                <h6 className="card-subtitle fw-normal mb-2">Completed</h6>
                                <p className="article text-sm">{project.completed}</p>
                            </div>

                            <div
                                className="w-50 w-md-auto pt-md-4"
                                style={{ alignSelf: 'start' }}
                            >
                                <h6 className="card-subtitle fw-normal mb-2">Collaborators</h6>
                                <p className="article text-sm">Individual Project</p>
                            </div>

                            {isPreview && project.slug && (
                                <div
                                    className="w-100 pb-md-6 pt-md-0 pt-3"
                                    style={{ alignSelf: 'end' }}
                                >
                                    <a
                                        target="_blank"
                                        rel="noopener"
                                        href={`/project/${project.slug}`}
                                        className={`btn btn-sm rounded-pill w-100 btn-soft-secondary`}
                                    >
                                        <SendFill size={12} className="mb-1" />
                                        <span className="ms-2">View Project</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
        </Fragment>
    );
};

ProjectHeader.defaultProps = {
    free: false,
    viewby: 'stack',
    isPreview: true
};

ProjectHeader.propTypes = {
    project: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    isPreview: PropTypes.bool
};

export default ProjectHeader;
