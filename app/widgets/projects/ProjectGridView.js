// import node module libraries
import React, {Fragment, useState} from 'react';
import { Row, Col, Button } from "react-bootstrap";

// import bootstrap icons
import { X } from 'react-bootstrap-icons';

// import widget/custom components
import ProjectCard from './ProjectCard';

// import data files
import { AllProjectsData } from '../../data/AllProjectsData';
import { CategoryData } from '../../data/CategoryData';

const ProjectGridView = () => {
	const [Records, setRecords] = useState(AllProjectsData.slice(0, 500));
	const [Categories] = useState(CategoryData.filter((element, index) => {
		return CategoryData.indexOf(element) === index;
	}));

	//------display filter start----------
	const [filter, setFilter] = useState('');
	const clearFilters = () => {
		setFilter('');
		setRecords(AllProjectsData.slice(0, 500));
	};

	const filterOptions = Categories.map((category, index) => {
		return (
			<Fragment key={index}>
				<button onClick={()=> {
					setFilter(category.title === filter ? '': category.title);
					setRecords(category.title === filter ? AllProjectsData.slice(0, 500) : AllProjectsData.filter((record) => record.categories.indexOf(category.title) > -1).slice(0, 500))
				}}
						role='button'
						className={`btn shadow-none btn-xs rounded-pill text-nowrap text-capitalize ${
							category.title === filter  ? `btn-${category.color_scheme}` : `btn-primary-light text-primary border-primary-200`} :
					`}>
					{category.title}
					{category.title === filter ? (
						<X size={14} className='ms-1' />
					) : (<span></span>)}
				</button>
			</Fragment>
		);
	});
	//------end of display filter----------

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
			<main className="container-fluid px-3 py-5 p-lg-6 p-xxl-8">
				<div className="d-flex gap-4 scrollable-x pb-3 px-3 border-bottom">
					{filterOptions.length > 0 ? (
						filterOptions
					) : (
						<span>No filters</span>
					)}
					<div onClick={clearFilters} className="align-items-center ms-auto text-sm text-muted text-primary-hover fw-semibold d-none d-md-flex" role="button">
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

			{/*<ReactPaginate*/}
			{/*	previousLabel={<ChevronLeft size="14px" />}*/}
			{/*	nextLabel={<ChevronRight size="14px" />}*/}
			{/*	pageCount={pageCount}*/}
			{/*	onPageChange={changePage}*/}
			{/*	containerClassName={'justify-content-center mb-0 pagination'}*/}
			{/*	previousLinkClassName={'page-link mx-1 rounded'}*/}
			{/*	nextLinkClassName={'page-link mx-1 rounded'}*/}
			{/*	pageClassName={'page-item'}*/}
			{/*	pageLinkClassName={'page-link mx-1 rounded'}*/}
			{/*	disabledClassName={'paginationDisabled'}*/}
			{/*	activeClassName={'active'}*/}
			{/*/>*/}
		</Fragment>
	);
};
export default ProjectGridView;
