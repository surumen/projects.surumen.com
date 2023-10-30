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
	Badge, Offcanvas, Button
} from 'react-bootstrap';

// import widget/custom components
import { CustomTippy } from '..';

// import custom components
import LevelIcon from '../miscellaneous/LevelIcon';

// import utility file
import { numberWithCommas } from 'helper/utils';
import {Avatar} from "../../components/bootstrap/Avatar";
import {ProjectDescription} from "../../sub-components";

const CourseCard = ({ item, viewby, showprogressbar, extraclass }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	/** Used in Course Filter Page  */
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
				// <GridView />
				<ListGroupView />
			) : viewby === 'list' ? (
				<ListView />
			) : (
				<ListGroupView />
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
							<ProjectDescription project={item}/>
						</Col>
					</Row>
				</Offcanvas.Body>
			</Offcanvas>
		</Fragment>
	);
};

// Specifies the default values for props
CourseCard.defaultProps = {
	free: false,
	viewby: 'grid',
	showprogressbar: false,
	extraclass: ''
};

// Typechecking With PropTypes
CourseCard.propTypes = {
	item: PropTypes.object.isRequired,
	free: PropTypes.bool,
	viewby: PropTypes.string,
	showprogressbar: PropTypes.bool,
	extraclass: PropTypes.string
};

export default CourseCard;
