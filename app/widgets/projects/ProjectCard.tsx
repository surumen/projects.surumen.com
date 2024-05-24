// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Offcanvas, Button } from 'react-bootstrap';

// import bootstrap icons
import { SendFill } from 'react-bootstrap-icons';

// import sub components
import ProjectSummary from './ProjectSummary';

// import data files
import { LanguageColorMap } from '@/data/ColorMap';


const ProjectCard = ({ project, viewby }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const getLanguageScheme = (language) => {
		return LanguageColorMap.filter(map => map.color === language)[0].scheme;
	}

	const ListStackView = () => {
		return (
			<div className='vstack gap-2 mx-n3'>
				<div onClick={() => handleShow()}
					 className='
					 position-relative
					 d-flex align-items-center
					 px-3 py-0 rounded-3
					 bg-body-secondary-hover
					 cursor-pointer'>

					<div className='flex-none'>
						<div className='icon icon-shape rounded-circle flex-none text-base bg-body-tertiary text-bg-body-secondary'>
							<SendFill size={16} />
						</div>
					</div>

					<div className='
					ms-3 ms-md-4 py-6
					border-bottom border-dotted border-top-0 border-start-0 border-end-0
					flex-fill
					'>

						<h4 className='text-heading fw-semibold mb-2'>{project.title}</h4>

						<div className='d-block text-sm text-muted gap-2 mb-3'>
							<span>{project.shortDescription}</span>
						</div>
						<div className='d-flex align-items-center gap-2 text-sm'>
							<span className='badge badge-lg badge-dot'>
								<i style={{ backgroundColor: getLanguageScheme(project.frameworks[0])}}></i>{project.frameworks[0]}
							</span>
						</div>

					</div>


				</div>
			</div>
		);
	};

	return (
		<Fragment>
			<ListStackView />
			<Offcanvas show={show}
					   className={'w-92 border-0'}
					   onHide={handleClose}
					   placement='end'
					   name='end'
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
