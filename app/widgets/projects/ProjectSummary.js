// import node module libraries
import React, { Fragment } from "react";
import { Row, Col, Image } from "react-bootstrap";
import Link from 'next/link';
import PropTypes from 'prop-types';
import { SendFill } from "react-bootstrap-icons";

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
					<div className='vstack gap-6 pointer-event'>
						<h1 className="ls-tight fw-bolder">{item.title}</h1>
						<div className='d-flex gap-4 flex-wrap'>
							{item.categories.map((category, index) => {
								return (
									<span key={index} className="bg-primary-light border rounded px-3 py-1 fw-semibold text-primary border-primary-200 text-xs rounded-pill">{category}</span>
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
							<span role='button' className="btn btn-sm bg-primary-600 text-bg-primary shadow-none rounded-pill">
								<span className='me-2'>View Live</span>
								<SendFill size={12} className='mb-1' />
							</span>
						</div>
					</div>
				</div>
			</Row>
			<section className='bg-body-secondary mx-n6 my-6 py-6 px-6'>
				<video loop={true} autoPlay={true}>
					<source src='/videos/sonos-radio-02.mp4' type='video/mp4'/>
				</video>
			</section>
		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
