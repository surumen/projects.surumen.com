// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

// import bootstrap icons
import { SendFill, Pin, Heart, HeartFill, PinFill, StarFill } from 'react-bootstrap-icons';



const ProjectHeader = ({ project, viewby, isPreview }) => {

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

                    <Col sm={12} md={2} className="d-flex flex-column">
                        <div className='vstack gap-6 mb-5 mb-md-0'>
                            <div>
                                <h6 className='card-subtitle fw-normal mb-2'>Completed</h6>
                                <p className='article text-sm'>{project.completed}</p>
                            </div>
                            <div>
                                <h6 className='card-subtitle fw-normal mb-2'>Collaborators</h6>
                                <p className='article text-sm'>Individual Project</p>
                            </div>
                            <div>
                                { isPreview ? (
                                    <a target={'_blank'} href={`/project/${project.slug}`} className='btn btn-sm bg-primary-600 text-bg-primary shadow-none rounded-pill'>
                                        <span className='me-2'>View Project</span>
                                        <SendFill size={12} className='mb-1' />
                                    </a>
                                ) : ( isPreview ? (
                                        <button disabled={true} className='btn btn-sm bg-primary-600 border-0 text-bg-primary shadow-none rounded-pill'>
                                            <span className='me-2'>Coming Soon</span>
                                            <SendFill size={12} className='mb-1' />
                                        </button>
                                    ) : (<span></span>)
                                )}
                            </div>
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
