// import node module libraries
import React, { Fragment, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

// import bootstrap icons
import { X } from 'react-bootstrap-icons';

// import widget/custom components
import ProjectCard from './ProjectCard';
import { Project } from '@/types';

// import data files
import { AllProjectsData } from '@/data/projects/AllProjectsData';

const ProjectGridView = () => {
	const [Records, setRecords] = useState<Project[]>(AllProjectsData.slice(0, 500));
	const Categories: string[] = Array.from(new Set(AllProjectsData.map((project: Project) => project.technologyAreas).flat()));

	//------display filters start----------
	const [filters, setFilters] = useState([]);
	const clearFilters = () => {
		setFilters([]);
		setRecords(AllProjectsData.slice(0, 500));
	};

	const addFilter = (category: string) => {
		let selectedFilters: string[] = [...filters];
		// @ts-ignore
		if (filters.indexOf(category) === -1) {
			selectedFilters.push(category);
		} else {
			selectedFilters = selectedFilters.filter(f => f !== category);
		}
		// @ts-ignore
		setFilters(selectedFilters);
		const filteredRecords = selectedFilters.length === 0 ? AllProjectsData.slice(0, 500) : AllProjectsData.filter(rec => recordIsFiltered(rec, selectedFilters)).slice(0, 500);
		setRecords(filteredRecords);

	};

	const isSelectedFilter = (category) => {
		// @ts-ignore
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
	const [pageNumber, setPageNumber] = useState(0);
	const RecordsPerPage = 9;
	const pagesVisited = pageNumber * RecordsPerPage;
	const pageCount = Math.ceil(Records.length / RecordsPerPage);
	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};
	let displayRecords = Records.slice(
		pagesVisited,
		pagesVisited + RecordsPerPage
	).map((Records, index) => {
		return (
			<Fragment key={index}>
				<ProjectCard item={Records} />
			</Fragment>
		);
	});
	//------end of grid display----------

	return (
		<Fragment>
			<main className='container-fluid px-3 py-5 p-lg-6 p-xxl-8'>
				<div className='d-flex gap-4 scrollable-x pb-3 px-3 border-bottom'>
					{filterOptions.length > 0 ? (
						filterOptions
					) : (
						<span>No filters</span>
					)}
					<div onClick={clearFilters} className='align-items-center ms-auto text-sm text-muted text-primary-hover fw-semibold d-none d-md-flex' role='button'>
						<X size={16} className='me-1' /> <span>Clear filters</span>
					</div>
				</div>
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
