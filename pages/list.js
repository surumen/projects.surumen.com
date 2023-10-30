// import node module libraries
import React, { Fragment, useState } from 'react';
import { Row, Col, Breadcrumb, Offcanvas, Button, Nav, Tab, ListGroup, Image } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'react-feather';

// import sub components
import { ProjectDescription }  from 'app/components';

// import widget/custom components
import { ProjectCard }  from 'app/widgets';

// import data files
import { AllProjectsData } from 'app/data/AllProjectsData';

// import utility file
import { numberWithCommas, getStatusColor } from 'app/helper/utils';

const ProjectList = () => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const filterOptions = [
		{ value: 'In Progress', label: 'In Progress' },
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Modified', label: 'Modified' },
		{ value: 'Finished', label: 'Finished' },
		{ value: 'Cancel', label: 'Cancel' }
	];

	const [Records] = useState(AllProjectsData.slice(0, 500));
	const displayRecords = Records.map((Records, index) => {
		return (
			<Col sm={12} md={12} lg={12} key={index}>
				<ProjectCard item={Records} viewby='list' />
			</Col>
		);
	});

	return (
		<Fragment>
			<Row>
				<Col lg={12} md={12} sm={12}>
					<div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
						<div className="mb-3 mb-md-0">
							<h1 className="mb-1 h2 fw-bold">Projects</h1>
						</div>
					</div>
				</Col>
			</Row>
			<Row>
				<ListGroup bsPrefix="list-unstyled" as="ul" className="contacts-list">
					{displayRecords.length > 0 ? (
						displayRecords
					) : (
						<Col>No matching records found.</Col>
					)}
				</ListGroup>
			</Row>

		</Fragment>
	);
};

export default ProjectList;
