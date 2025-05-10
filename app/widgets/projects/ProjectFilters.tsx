import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { X } from 'react-bootstrap-icons';

import useProjects from '@/hooks/useProjects';
import { applyFilter, clearFilters, setSearch } from '@/store/projectsSlice';


const ProjectFilters = (props) => {

	const { filters, activeFilters, search } = useProjects();
	const dispatch = useDispatch();
	const isSelectedFilter = (category: string) => {
		return activeFilters.indexOf(category) > -1;
	};

	const scrollStyle = useMemo<React.CSSProperties>(
		() => ({
			display: 'flex',
			flexWrap: 'nowrap',
			overflowX: 'auto',
			msOverflowStyle: 'none',
			scrollbarWidth: 'none',
		}),
		[]
	);

	return (
		<Fragment>
			<div className='row align-items-center overflow-x-auto g-6 m-0'>
				<ul className='row list-unstyled flex-nowrap' style={scrollStyle}>
					{filters.map((category: any, index: number) => {
						return (
							<li key={index} className='col-auto'>
								<button onClick={()=> {dispatch(applyFilter(category))}}
										className={`btn btn-sm rounded-pill shadow-none ${isSelectedFilter(category)  ? `btn-primary border-primary` : `btn-outline-primary`}`}>
									{category}
									{isSelectedFilter(category) ? (
										<X size={14} className='ms-2 me-n1' />
									) : (<span></span>)}
								</button>
							</li>
						);
					})}
					<li className='col-auto'>
						<button onClick={()=> {dispatch(clearFilters())}}
								disabled={activeFilters.length === 0}
								className="btn btn-sm btn-light border rounded-pill">
							<span className='pe-2'><X size={16} /></span>
							<span>Clear Filters</span>
						</button>
					</li>
				</ul>
			</div>

		</Fragment>
    );
};

ProjectFilters.defaultProps = {
	search: true
};

ProjectFilters.propTypes = {
	search: PropTypes.bool,
};

export default ProjectFilters;
