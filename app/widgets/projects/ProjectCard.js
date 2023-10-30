// import node module libraries
import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
	Image,
	Card,
	Row,
	Col,
	ListGroup,
	Badge,
	Offcanvas,
	Button,
} from 'react-bootstrap';


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
						<div className='icon icon-shape flex-none text-base text-bg-dark rounded-circle'>
							<Image src='/images/svg/moon.svg' alt="" className='w-rem-6 h-rem-6'></Image>
						</div>
					</div>

					<div className="ms-3 ms-md-4 flex-fill">

						<div className="stretched-link text-limit text-heading fw-semibold mb-2">{item.title}</div>

						<div className="d-block text-sm text-muted gap-2 mb-2">
							<span>{item.shortdescription}</span>
						</div>

						<div className="d-flex align-items-center gap-2 text-sm">
							<span className="badge bg-body-secondary text-bg-secondary text-capitalize rounded-pill">{item.category}</span>
						</div>

					</div>


				</div>
			</div>
		);
	};

	return (
		<Fragment>
			{viewby === 'grid' ? (
				<ListStackView />
			) : viewby === 'list' ? (
				<ListStackView />
			) : (
				<ListStackView />
			)}
			<Offcanvas
				show={show}
				onHide={handleClose}
				placement="end"
				name="end"
				style={{ width: '92vw' }}
			>
				<Offcanvas.Header className="justify-content-end">
					<Button variant="light" className="border" onClick={handleClose}>Close</Button>
				</Offcanvas.Header>
				<Offcanvas.Body className="pt-0">
					<Row>
						<Col xs={12} className="mb-4">
							{/* project summary section */}
							{/*<ProjectDescription project={item}/>*/}
						</Col>
					</Row>
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
