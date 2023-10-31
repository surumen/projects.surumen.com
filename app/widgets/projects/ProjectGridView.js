// import node module libraries
import React, {Fragment, useState} from 'react';
import { Row, Col } from 'react-bootstrap';

// import bootstrap icons
import { X } from 'react-bootstrap-icons';

// import widget/custom components
import ProjectCard from './ProjectCard';

// import data files
import { AllProjectsData } from '../../data/AllProjectsData';

const ProjectGridView = () => {
	const [Records] = useState(AllProjectsData.slice(0, 500));

	//------grid display start----------
	const [pageNumber, setPageNumber] = useState(0);
	const RecordsPerPage = 9;
	const pagesVisited = pageNumber * RecordsPerPage;
	const pageCount = Math.ceil(Records.length / RecordsPerPage);
	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};
	const displayRecords = Records.slice(
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

	//------display filter start----------
	let categories = Records.map((record) => {
		return record.categories;
	}).flat();
	categories = categories.filter((element, index) => {
		return categories.indexOf(element) === index;
	});

	const filterOptions = categories.map((category, index) => {
		return (
			<Fragment key={index}>
				<button
					role='button'
					className='btn btn-xs btn-outline-primary rounded-pill text-nowrap text-capitalize'>
					{category}
				</button>
			</Fragment>
		);
	});
	//------end of display filter----------

	return (
		<Fragment>
			<main className="container-fluid px-3 py-5 p-lg-6 p-xxl-8">
				<div className="d-flex gap-4 scrollable-x pb-3 px-3 border-bottom">
					{filterOptions.length > 0 ? (
						filterOptions
					) : (
						<span>No filters</span>
					)}
					<div className="align-items-center ms-auto text-sm text-muted text-primary-hover fw-semibold d-none d-md-flex" role="button">
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
