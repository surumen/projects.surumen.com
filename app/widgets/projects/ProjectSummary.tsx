import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';
import dynamic from 'next/dynamic';

import MarkdownDisplay from './Markdown';
import ProjectHeader from './ProjectHeader';


const ProjectSummary = ({ project, blog, isPreview }) => {

	const navContent: any = [];
	if (blog && project.hasBlog) {
		const headings: string[] = Array.from(blog.match(/#{1,2}.+/g));
		headings.forEach(header => {
			const numHashes = (header.match(/#/g) || []).length;
			if (numHashes > 0 && numHashes < 3) {
				navContent.push(header.replace(/#/g,'').trim());
			}
		});
	}

	// Convention-based dynamic component loading with named files
	const getComponentName = (slug: string): string => {
		// Convert kebab-case slug to PascalCase component name
		return slug
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join('')
			.replace(/Ai/, 'AI')  // Handle AI acronym
			.replace(/D3/, 'D3')  // Handle D3 acronym
			.replace(/NextJs/, 'NextJS'); // Handle NextJS acronym
	};

	const DemoComponent = project.hasDemo 
		? dynamic(() => {
			const componentName = getComponentName(project.slug);
			// Map specific component names to their actual file names
			const componentFileMap: Record<string, string> = {
				'TournamentBracketsAIAssistant': 'TournamentAssistant',
				'FantasyManagerAssistant': 'FantasyAssistant', 
				'DataVisualizationD3NextJS': 'DataVisualization'
			};
			
			const fileName = componentFileMap[componentName] || componentName;
			return import(`@/components/demos/${project.slug}/${fileName}`);
		}, {
			ssr: false,
			loading: () => <div className="text-center py-5">Loading demo...</div>
		})
		: null;

	return (
		<Fragment>
			<ProjectHeader project={project} isPreview={isPreview} />

			{project.hasBlog && blog ? (
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
			) : null}

			{project.hasDemo && DemoComponent ? (
				<DemoComponent />
			) : null}

			{!project.hasBlog && !project.hasDemo ? (
				<div className='overflow-auto'>
					<Row className='overflow-auto'>
						<Col className='overflow-auto'>
							<div className="text-center py-5">
								<p>No demo or blog content available for this project.</p>
							</div>
						</Col>
					</Row>
				</div>
			) : null}
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
