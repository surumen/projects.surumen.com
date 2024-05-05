// import node module libraries
import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';


// import widget/custom components
import ProjectCard from './ProjectCard';
import useProjects from '@/hooks/useProjects';


const ProjectGridView = () => {

	const { projects, activeFilters } = useProjects();

	/** filter projects based on selected filter option */
	const filteredRecords = activeFilters.length === 0 ? projects :
		projects.filter(project => project.technologyAreas.some(category => activeFilters.includes(category)));


	let displayRecords = filteredRecords.map((project, index) => {
		return (
			<ProjectCard key={index} project={project} />
		);
	});

	return (
		<main className='container-fluid px-3 py-5 p-lg-6 pt-lg-0'>
			<Row>
				<Col>
					{displayRecords.length > 0 ? (
						displayRecords
					) : (
						<span>No matching records found.</span>
					)}
				</Col>
			</Row>
		</main>
	);
};

export default ProjectGridView;
