// import node module libraries
import React, {Fragment, useState} from 'react';
import { Row, Col } from 'react-bootstrap';

// import widget/custom components
import { ProjectCard } from '../widgets';

// import data files
import { AllProjectsData } from '../data/AllProjectsData';

const ProjectGridView = () => {
	const [Records] = useState(AllProjectsData.slice(0, 500));

	//------paging start----------
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
	//---end of paging start----------

	return (
		<Fragment>
			<Row>
				<Col>
					{displayRecords.length > 0 ? (
						displayRecords
					) : (
						<span>No matching records found.</span>
					)}
				</Col>
			</Row>

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
