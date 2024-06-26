// import node module libraries
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';

import MarkdownDisplay from './Markdown';
import { COMPONENTS_MAP } from '@/helpers';


const ProjectSummary = ({ project, blog, isPreview }) => {


	const navContent: any = [];
	if (blog && project.contentType === 'blog') {
		const headings: string[] = Array.from(blog.match(/#{1,2}.+/g));
		headings.forEach(header => {
			const numHashes = (header.match(/#/g) || []).length;
			if (numHashes > 0 && numHashes < 3) {
				navContent.push(header.replace(/#/g,'').trim());
			}
		});
	}

	const DemoAppComponent = project.contentType !== 'blog' ? COMPONENTS_MAP[project.component] : null;

	return (
		<Fragment>
			<section className={`container mw-screen-xxl ${isPreview ? 'pb-5' : 'p-5 mt-5'}`}>
				<Row className={`mb-3 ${isPreview ? 'pb-5' : 'py-5'}`}>
					<Col className='d-flex' sm={12} md={4}>
						<div className='vstack justify-content-between gap-6 pointer-event mb-5 mb-md-0'>
							<h1 className='ls-tight fw-bolder'>{project.title}</h1>
							<div className='d-flex gap-4 flex-wrap'>
								{project.technologyAreas.slice(0, 2).map((category, index) => {
									return (
										<span key={index} className='btn btn-xs border-warning text-warning disabled opacity-100 px-3 py-1 rounded-pill'>{category}</span>
									)
								})
								}
							</div>
						</div>
					</Col>

					<Col sm={12} md={6}>
						<div className='vstack gap-4 mb-5 mb-md-0'>
							<p className='text-muted text-xs text-uppercase'>Project Description</p>
							<p className='article'>
							<span
								dangerouslySetInnerHTML={{
									__html: project.description
								}}
							></span>
							</p>
						</div>
					</Col>

					<Col sm={12} md={2}>
						<div className='vstack gap-6 mb-5 mb-md-0'>
							<div>
								<p className='text-muted text-xs text-uppercase mb-2'>Completed</p>
								<p className='article text-sm'>{project.completed}</p>
							</div>
							<div>
								<p className='text-muted text-xs text-uppercase mb-2'>Collaborators</p>
								<p className='article text-sm'>Individual Project</p>
							</div>
							<div>
								{ isPreview && project.hasWriteUp ? (
										<a target={'_blank'} href={`/project/${project.slug}`} className='btn btn-sm bg-primary-600 text-bg-primary shadow-none rounded-pill'>
											<span className='me-2'>View Project</span>
											<SendFill size={12} className='mb-1' />
										</a>
								) : ( isPreview ? (
										<button disabled={true} className='btn btn-sm bg-primary-600 border-0 text-bg-primary shadow-none rounded-pill'>
											<span className='me-2'>Coming Soon</span>
											<SendFill size={12} className='mb-1' />
										</button>
									) : (<span></span>)
								)}
							</div>
						</div>
					</Col>

				</Row>
			</section>

			<section className={`container border rounded mw-screen-xxl py-5 ${project.contentType === 'app' ? 'bg-body-secondary' : ''}`}>
				{project.contentType === 'blog' ? (
					<Row className='pt-4'>
						<Col md={3}>
							<ul className='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
								{navContent.map((navigation, index) => {
									return (
										<li key={index} className='nav-item'>
											<a className='nav-link px-0' href={`#${navigation.replace(/ /g,'-').toLowerCase()}`}>
												{navigation}
											</a>
										</li>
									);
								})}
							</ul>
						</Col>
						<Col md={9}>
							<article className='article'>
								<MarkdownDisplay content={blog} />
							</article>
						</Col>
					</Row>
				) : ( project.contentType === 'app' ? (
						<Row>
							<Col>
								<DemoAppComponent />
							</Col>
						</Row>
					) : (
						<div className='overflow-auto'>
							<Row className='overflow-auto'>
								<Col className='overflow-auto'>
								</Col>
							</Row>
						</div>
					)
				)}
			</section>

		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	project: PropTypes.object.isRequired,
	blog: PropTypes.string,
	isPreview: PropTypes.bool
};

export default ProjectSummary;
