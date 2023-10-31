// import node module libraries
import React, { Fragment } from "react";
import { Row, Col, Image } from "react-bootstrap";
import Link from 'next/link';
import PropTypes from 'prop-types';

const ProjectSummary = ({ item }) => {

	const CategoryColors = (category) => {
		switch (category) {
			case 'Courses':
				return 'success';
			case 'Tutorial':
				return 'primary';
			case 'Workshop':
				return 'warning';
			case 'Company':
				return 'info';
			default:
				return 'primary';
		}
	};

	return (
		<Fragment>
			<Row className='row-cols-1 row-cols-sm-2 row-cols-xl-3 gap-xl-1 gap-6'>
				<div className='col col-xl-4'>
					<div className='vstack gap-6'>
						<h1 className="ls-tight fw-bolder">{item.title}</h1>
						<div className='d-flex gap-4'>
							{item.categories.map((category, index) => {
								return (
									<span key={index} className="badge badge-md bg-gray-light text-gray border border-gray rounded-pill">{category}</span>
								)
							})
							}
						</div>
					</div>
				</div>
				<div className='col col-xl-5'>
					<div className='vstack gap-4'>
						<p className='text-muted text-xs text-uppercase'>Project Description</p>
						<p className='article'>
							<span
								dangerouslySetInnerHTML={{
									__html: item.description
								}}
							></span>
						</p>
					</div>
				</div>
				<div className='col col-xl-2'>
					<div className='vstack gap-6'>
						<div>
							<p className='text-muted text-xs text-uppercase mb-2'>Completed</p>
							<p className='article text-sm'>2022</p>
						</div>
						<div>
							<p className='text-muted text-xs text-uppercase mb-2'>Collaborators</p>
							<p className='article text-sm'>Individual Project</p>
						</div>
						<div>
							<span role='button' className="badge badge-md bg-primary-600 text-bg-primary border border-primary-600 rounded-pill">
								<span className='me-2'>View Demo</span>
								<Image src="/images/svg/external-link.svg" alt="" className="h-rem-8 h-rem-md-16" />
							</span>
						</div>
					</div>
				</div>
			</Row>
			<hr className="my-6"/>

		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
