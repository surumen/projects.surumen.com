// import node module libraries
import React, { Fragment, useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";

// import bootstrap icons
import { X } from "react-bootstrap-icons";

// import widget/custom components
import ProjectCard from "./ProjectCard";
import { Project } from '@/types';

// import data files
import { ProjectsContext } from "../../../pages/_app";

const ProjectGridView = () => {
	const context = useContext(ProjectsContext);
	// @ts-ignore
	const projects: Project[] = context;

	const [Records, setRecords] = useState<Project[]>(projects);
	const Categories: string[] = Array.from(new Set(projects.map((project: Project) => project.technologyAreas).flat()));

	//------display filters start----------
	const [filters, setFilters] = useState<string[]>([]);
	const clearFilters = () => {
		setFilters([]);
		setRecords(projects);
	};

	const addFilter = (category: string) => {
		let selectedFilters: string[] = [...filters];
		if (filters.indexOf(category) === -1) {
			selectedFilters.push(category);
		} else {
			selectedFilters = selectedFilters.filter(f => f !== category);
		}
		setFilters(selectedFilters);
		const filteredRecords = selectedFilters.length === 0 ? projects : projects.filter(rec => recordIsFiltered(rec, selectedFilters));
		setRecords(filteredRecords);

	};

	const isSelectedFilter = (category: string) => {
		return filters.indexOf(category) > -1;
	};

	const recordIsFiltered = (record, filters) => {
		return filters.some(r => record.technologyAreas.includes(r));
	}

	const filterOptions = Categories.map((category, index) => {
		return (
			<Fragment key={index}>
				<button onClick={()=> {addFilter(category)}}
						role='button'
						className={`btn shadow-none btn-xs rounded-pill text-nowrap text-capitalize ${
							isSelectedFilter(category)  ? `btn-primary` : `btn-primary-light text-primary`} :
					`}>
					{category}
					{isSelectedFilter(category) ? (
						<X size={14} className='ms-1' />
					) : (<span></span>)}
				</button>
			</Fragment>
		);
	});
	//------end of display filters----------

	//------grid display start----------

	let displayRecords = Records.map((Record, index) => {
		return (
			<Fragment key={index}>
				<ProjectCard item={Record} />
			</Fragment>
		);
	});
	//------end of grid display----------

	return (
		<Fragment>
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
		</Fragment>
	);
};
export default ProjectGridView;
