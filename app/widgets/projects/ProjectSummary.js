// import node module libraries
import React, { Fragment } from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { SendFill } from 'react-bootstrap-icons';

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
			<section className='container mw-screen-xl border-bottom mx-n6 pb-6 pt-4 ps-6 pe-0'>
				<div className='row mb-3'>
					<div className='col col-md-4'>
						<div className='vstack gap-6 pointer-event'>
							<h1 className='ls-tight fw-bolder'>{item.title}</h1>
							<div className='d-flex gap-4 flex-wrap'>
								{item.categories.map((category, index) => {
									return (
										<span key={index} className='bg-primary-light border rounded px-3 py-1 fw-semibold text-primary border-primary-200 text-xs rounded-pill'>{category}</span>
									)
								})
								}
							</div>
						</div>
					</div>

					<div className='col col-md-6'>
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

					<div className='col col-md-2'>
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
							<span role='button' className='btn btn-sm bg-primary-600 text-bg-primary shadow-none rounded-pill'>
								<span className='me-2'>View Live</span>
								<SendFill size={12} className='mb-1' />
							</span>
							</div>
						</div>
					</div>

				</div>
			</section>

			<section className='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
				<div className='row'>
					<div className='col-lg-3'>
						<ul className='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-1'>
									Introduction
								</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-3'>Restrictions</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-4'>Your Content</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-5'>No warranties</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
							</li>
						</ul>
					</div>
					<div className='col-lg'>
						<article className='article'>
							<h2 id='item-1'>Introduction</h2>
							<p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.</p>
							<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website
								Standard Terms and Conditions.</p>
							<p>Minors or people below 18 years old are not allowed to use this Website.</p>

							<h2 id='item-2'>Intellectual Property Rights</h2>
							<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
							<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

							<h2 id='item-4'>Your Content</h2>
							<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
								irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
							<p>Your Content must be your own and must not be invading any third-party's rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>

							<h2 id='item-5'>No warranties</h2>
							<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
								interpreted as advising you.</p>

							<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
							<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
						</article>
					</div>
				</div>
			</section>
		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
