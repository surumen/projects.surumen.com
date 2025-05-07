// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Offcanvas, Button, Col, Nav } from 'react-bootstrap';

// import bootstrap icons
import { SendFill, Pin, Heart, HeartFill, PinFill, StarFill } from 'react-bootstrap-icons';

// import sub components
import ProjectSummary from './ProjectSummary';

// import data files
import { LanguageColorMap } from '@/data/ColorMap';


const ProjectCard = ({ project, viewby }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const getLanguageScheme = (language) => {
		const val = LanguageColorMap.filter(map => map.color === language)[0].scheme;
		console.log(val)
		return LanguageColorMap.filter(map => map.color === language)[0].scheme;
	}

	const ListStackView = () => {
		return (
			<Nav.Link className="card shadow-none rounded-0 border-0 border-bottom card-dotted mb-0">
				<div className='card-body'>
					<div className='d-flex align-items-md-center'>
						<div onClick={() => handleShow()} className='flex-shrink-0'>
							<div className='icon icon-shape rounded-circle flex-none text-base bg-body-tertiary text-bg-body-secondary'>
								<SendFill size={16} />
							</div>
						</div>

						<div className='flex-grow-1 ms-5'>
							<div className="row align-items-md-center justify-content-between">
								<Col onClick={() => handleShow()} sm={10} className='mb-2 mb-md-0'>
									<h4 className="mb-2 fw-semibold">{project.title}</h4>
									<p className="text-muted">{project.shortDescription}</p>
									<div className="row fs-6 text-body">
										{
											project.frameworks.map((framework, index) => {
												return (
													<div key={index} className="col-auto">
														<span className={`legend-indicator bg-accent-${getLanguageScheme(framework)}`}></span>
														{framework}
													</div>
												);
											})
										}
									</div>
								</Col>
								<Col sm={3} className="col-md-auto order-md-last text-end ms-n3">
									<button className="btn btn-ghost-primary btn-icon btn-sm rounded-circle">
										<Heart size={16}/>
									</button>
								</Col>
							</div>
						</div>
					</div>
				</div>
			</Nav.Link>
		);
	};

	return (
		<Fragment>
			<ListStackView />
			<Offcanvas show={show}
					   className={'border-0'}
					   onHide={handleClose}
					   placement='end'
					   name='end'
					   style={{width: 'calc(100vw - 8rem)'}}
			>
				<Offcanvas.Header className='justify-content-end border-bottom'>
					<Button onClick={handleClose} className='btn d-inline-flex btn-sm btn-neutral shadow-none rounded-pill'><span>Back Home</span></Button>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<ProjectSummary project={project} isPreview={true} />
				</Offcanvas.Body>
			</Offcanvas>
		</Fragment>
	);
};

// Specifies the default values for props
ProjectCard.defaultProps = {
	free: false,
	viewby: 'stack'
};

// Typechecking With PropTypes
ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	free: PropTypes.bool,
	viewby: PropTypes.string
};

export default ProjectCard;
