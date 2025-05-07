// import node module libraries
import React, { Fragment, useState } from 'react';
import { Col, Row } from 'react-bootstrap';


// import widget/custom components
import ProjectCard from './ProjectCard';
import useProjects from '@/hooks/useProjects';
import { ProjectFilters, Pagination } from '@/widgets';


const ProjectGridView = () => {

	const { projects, activeFilters } = useProjects();

	const filteredRecords = activeFilters.length === 0 ? projects :
		projects.filter(project => project.technologyAreas.some(category => activeFilters.includes(category)));
	const [page, setPage] = useState(1);
	const totalPages = 5;

	let displayRecords = filteredRecords.map((project, index) => {
		return (
			<ProjectCard key={index} project={project} />
		);
	});

	return (
		<Fragment>
			<ProjectFilters />
			<Row>
				<Col className="ps-0">
					{displayRecords.length > 0 ? (
						displayRecords
					) : (
						<span>No matching records found.</span>
					)}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col className="ps-0">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
						className="justify-content-center mt-4"
					/>
				</Col>
			</Row>
		</Fragment>
	);
};

export default ProjectGridView;
