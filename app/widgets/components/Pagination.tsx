import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const Pagination = ({
						currentPage,
						totalPages,
						onPageChange,
						className = '',
					}) => {
	const pages = useMemo(
		() => Array.from({ length: totalPages }, (_, i) => i + 1),
		[totalPages]
	);

	const goPrev = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const goNext = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	return (
		<Row>
			<Col xs={12}>
				<nav>
					<ul className={`pagination pagination-spaced ${className}`}>
						{/* Prev */}
						<li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
							<button
								className='page-link'
								style={{ outline: 'none', boxShadow: 'none' }}
								onClick={goPrev}
								disabled={currentPage === 1}
							>
								<span>Prev</span>
							</button>
						</li>

						{/* Page numbers */}
						{pages.map((page) => (
							<li
								key={page}
								className={`page-item ${page === currentPage ? 'active' : ''}`}
							>
								<button
									className='page-link'
									style={{ outline: 'none', boxShadow: 'none' }}
									onClick={() => onPageChange(page)}
								>
									{page}
								</button>
							</li>
						))}

						{/* Next */}
						<li
							className={`page-item${
								currentPage === totalPages ? ' disabled' : ''
							}`}
						>
							<button
								className='page-link'
								style={{ outline: 'none', boxShadow: 'none' }}
								onClick={goNext}
								disabled={currentPage === totalPages}
							>
								<span>Next</span>
							</button>
						</li>
					</ul>
				</nav>
			</Col>
		</Row>
	);
};

Pagination.propTypes = {
	/** The currently active page (1-based) */
	currentPage: PropTypes.number.isRequired,
	/** Total number of pages available */
	totalPages: PropTypes.number.isRequired,
	/** Callback(pageNumber) when user clicks a page or Prev/Next */
	onPageChange: PropTypes.func.isRequired,
	/** Additional classes to apply to the <ul> */
	className: PropTypes.string,
};

export default Pagination;
