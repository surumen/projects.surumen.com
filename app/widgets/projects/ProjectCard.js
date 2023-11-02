// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Image, Offcanvas, Button, } from 'react-bootstrap';

// import bootstrap icons
import { SendFill } from 'react-bootstrap-icons';

// import sub components
import ProjectSummary from './ProjectSummary';



const ProjectCard = ({ item, viewby }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);


	const ListStackView = () => {
		return (
			<div className="vstack gap-2 mx-n3">
				<div onClick={() => handleShow()}
					 className="
					 position-relative
					 d-flex align-items-center
					 p-3 rounded-3
					 bg-body-secondary-hover
					 border-bottom
					 cursor-pointer">

					<div className='flex-none'>
						<div className='icon icon-shape rounded-circle flex-none text-base bg-success-100 text-success'>
							<SendFill size={16} />
						</div>
					</div>

					<div className="ms-3 ms-md-4 flex-fill">

						<div className="text-heading fw-semibold mb-2">{item.title}</div>

						<div className="d-block text-sm text-muted gap-2 mb-2">
							<span>{item.shortdescription}</span>
						</div>
						<div className="d-flex align-items-center gap-2 text-sm">
							{item.categories.map((category, index) => {
								return (
									<span key={index} className="bg-white bg-opacity-20 bg-opacity-100-hover border text-bg-white px-3 py-1 font-semibold text-heading text-xs rounded-pill">{category}</span>
								);
							})}
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
					   onHide={handleClose}
					   placement="end"
					   name="end"
					   style={{ width: '92vw', border: 'none'}}>
				<Offcanvas.Header className="justify-content-end border-bottom">
					<Button onClick={handleClose} className="btn d-inline-flex btn-sm btn-neutral shadow-none rounded-pill"><span>Back Home</span></Button>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<ProjectSummary item={item} />
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
	item: PropTypes.object.isRequired,
	free: PropTypes.bool,
	viewby: PropTypes.string
};

export default ProjectCard;
