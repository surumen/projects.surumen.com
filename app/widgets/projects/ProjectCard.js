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
							<span className="badge bg-body-secondary rounded-pill text-dark">React</span>
						</div>

					</div>


				</div>
			</div>
		);
	};

	const ListView = () => {
		return (
			<Card className="mb-4 card-hover">
				<Row className="g-0" onClick={() => handleShow()}>
					<Col lg={3} md={0} sm={0}>
						<Image src={item.image} alt="" className="rounded img-4by3-lg" />
					</Col>
					<Col lg={9} md={12} sm={12}>
						{/* <!-- Card body --> */}
						<Card.Body>
							<h3 className="mb-2 text-truncate-line-2 ">
								<Link href="#" className="text-inherit">
									{item.title}
								</Link>
							</h3>
							<p className="font-size-md">{item.shortdescription}</p>
							{/* <!-- Row --> */}
							<Row className="align-items-center g-0">
								<Col className="col-auto">
									<Image
										src={item.instructor_image}
										className="rounded-circle avatar-xs"
										alt=""
									/>
								</Col>
								<Col className="col ms-2">
									<span>{item.instructor_name}</span>
								</Col>
							</Row>
						</Card.Body>
					</Col>
				</Row>
			</Card>
		);
	};

	const ListGroupView = () => {
		return (
			<ListGroup.Item
				as="li"
				bsPrefix=" "
				key={item.uuid}
				role="button"
				className='py-3 px-4 chat-item contacts-item'
			>
				<div
					className="d-flex justify-content-between align-items-center"
					onClick={() => handleShow()}
				>
					<Link href="#" className="text-link contacts-link">
						<div className="d-flex">
							<Avatar
								size="md"
								className="rounded-circle"
								type='image'
								src={item.image}
								alt={item.title}
								name={item.title}
							/>
							<div className=" ms-2">
								<h5 className="mb-0 fw-bold"> {item.title}</h5>
								<p
									className="mb-0 text-muted text-truncate">
									{item.shortdescription}
								</p>
							</div>
						</div>
					</Link>
				</div>
			</ListGroup.Item>
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
				style={{ width: '90vw' }}
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
