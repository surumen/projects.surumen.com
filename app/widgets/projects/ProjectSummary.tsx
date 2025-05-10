import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';

import MarkdownDisplay from './Markdown';
import { COMPONENTS_MAP } from '@/helpers';
import ProjectHeader from './ProjectHeader';


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
			<ProjectHeader project={project} isPreview={isPreview} />

			{project.contentType === 'blog' ? (
				<section className={`container border rounded mw-screen-xxl py-5 bg-body-secondary`}>
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
				</section>
			) : ( project.contentType === 'app' ? (
					<DemoAppComponent />
				) : (
					<div className='overflow-auto'>
						<Row className='overflow-auto'>
							<Col className='overflow-auto'>
							</Col>
						</Row>
					</div>
				)
			)}

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
