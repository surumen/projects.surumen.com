// import node module libraries
import React, { forwardRef, Fragment, useRef, useState } from "react";
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

// import bootstrap icons
import {
	InputGroup,
	Form,
	Dropdown
} from 'react-bootstrap';
import { Search, SendFill, X } from 'react-bootstrap-icons';

// import sub components
import QuickMenu from '@/widgets/navbars/QuickMenu';
import useProjects from '@/hooks/useProjects';
import useMounted from '@/hooks/useMounted';
import { applyFilter, clearFilters, setSearch } from '@/store/projectsSlice';


const NavbarTop = (props) => {

	const hasMounted = useMounted();
	const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });
	const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

	const { projects, languages, filters, activeFilters, search } = useProjects();
	const dispatch = useDispatch();

	const [showSearchDropdown, setShowSearchDropdown] = useState(false);
	const searchInputRef = useRef(null);
	const searchDropdownRef = useRef(null);

	const isSelectedFilter = (category: string) => {
		return activeFilters.indexOf(category) > -1;
	};

	const filterOptions = filters.map((category, index) => {
		return (
			<button key={index} onClick={()=> {dispatch(applyFilter(category))}}
					className={`btn btn-sm rounded-pill ${isSelectedFilter(category)  ? `btn-primary` : `btn-outline-primary`}`}>
				{category}
				{isSelectedFilter(category) ? (
					<X size={14} className='ms-2 me-n1' />
				) : (<span></span>)}
			</button>
		);
	});


	/** filter recordset based on search inputs */
	const searchResults = projects.filter(project => {
		if (!search) {
			return [];
		}
		return project.title.toLowerCase().includes(search.toLowerCase())
			|| project.technologyAreas.join(' ').toLowerCase().includes(search.toLowerCase())
			|| project.shortDescription.toLowerCase().includes(search.toLowerCase());
	}).slice(0, 6);


	const RecentSearches = () => {
		return (
			<Fragment>
				<div className='surtitle surtitle-sm px-3 py-2 d-flex align-items-center'>Recent Searches</div>
				<div className='dropdown-item bg-transparent text-wrap d-flex gap-2'>
					<button type='button' className='btn btn-xs text-xs bg-primary bg-opacity-75 text-bg-primary rounded-pill shadow-none bg-opacity-100-hover text-white-hover'>
						Machine learning
						<Search size={18} className='ps-2' />
					</button>
				</div>
			</Fragment>
		);
	}

	const SearchProjectResults = () => {
		return (
			<Fragment>
				<div className='surtitle surtitle-sm px-3 py-2 d-flex align-items-center'>Projects</div>
				{searchResults.map((record, index) => {
					return (
						<Dropdown.Item key={index} className='py-3 d-flex' target={'_blank'} href={`/project/${record.slug}`} rel={"noreferrer"}>
							<div className='d-flex align-items-center'>
								<div className='flex-shrink-0'>
									<div className='icon icon-sm icon-shape w-rem-10 h-rem-10 rounded-circle flex-none text-base bg-warning bg-opacity-25 text-warning'>
										<SendFill size={8} />
									</div>
								</div>
								<div className='flex-grow-1 text-truncate text-sm lg-snug w-rem-64 text-wrap ms-3'>
									<span>{record.title}</span>
								</div>
							</div>
						</Dropdown.Item>
					)
				})}
			</Fragment>
		);
	}


	const ProjectLanguagesOptions = () => {
		return (
			<Fragment>
				<div className='surtitle surtitle-sm px-3 py-2 d-flex align-items-center'>Languages used</div>

				{languages.map((language, index) => {
					return (
						<Dropdown.Item key={index} className='py-3 d-flex'>
							<div className='d-flex align-items-center'>
								<div className='flex-shrink-0'>
									<div className='icon icon-shape w-rem-8 h-rem-8 rounded-circle text-sm bg-success bg-opacity-25 text-success fw-bolder'>
										P
									</div>
								</div>
								<div className='flex-grow-1 text-truncate text-sm lg-snug w-rem-64 text-wrap ms-3'>
									<span>{language}</span>
								</div>
							</div>
						</Dropdown.Item>
					)
				})}
			</Fragment>
		);
	}

	const SearchDropdownMenu = () => {
		return (
			<Dropdown.Menu
				ref={searchDropdownRef}
				className='dropdown-menu dropdown-menu-start px-2 pt-3 mt-2 mw-100'
				show={hasMounted && isDesktop && showSearchDropdown}
				style={{minWidth: '20rem'}}
			>
				{searchResults.length > 0 && !search ? (
					<Fragment>
						<RecentSearches />
						<div className='dropdown-divider'></div>
						<SearchProjectResults />
						<div className='dropdown-divider'></div>
						<ProjectLanguagesOptions />
					</Fragment>
				) : (searchResults.length > 0 && search) ? (
					<SearchProjectResults />
				) : (
					<div className='p-3 d-flex'>No records found</div>
				)}
			</Dropdown.Menu>
		)
	}

	return (
		<div className='d-none d-lg-block border-bottom p-5 pb-4'>
			<div className='d-none d-lg-flex'>
				{props.search ? (
					<div className='dropdown'>
						<Form className='flex-none'>
							<InputGroup
								className='input-group input-group-sm input-group-inline bg-body-secondary ps-2 w-rem-80 h-rem-10 rounded-pill shadow-none'>
								<InputGroup.Text className='input-group-text rounded-start-pill bg-transparent border-0'>
									<Search size={12} className='me-2'/>
								</InputGroup.Text>
								<Form.Control
									type='search'
									ref={searchInputRef}
									className='form-control rounded-end-pill bg-transparent border-0'
									placeholder='Search projects, skills, interests...'
									onFocus={() => setShowSearchDropdown(true)}
									onChange={(e) => dispatch(setSearch(e.target.value))}
								/>
							</InputGroup>
						</Form>
						<SearchDropdownMenu />
					</div>
				) : (<Fragment></Fragment>)}
				<div className='hstack flex-fill justify-content-end flex-nowrap gap-6 ms-auto px-6 px-xxl-8'>
					<QuickMenu/>
				</div>
			</div>

			<div className='row align-items-center g-6 m-0'>
				<div className='col-sm-9'>
					<div className='hstack gap-4 scrollable-x pt-4 px-0'>
						{filterOptions.length > 0 ? (
							filterOptions
						) : (
							<span>No filters</span>
						)}
					</div>
				</div>
				<div className='col-sm-3'>
					<div className='hstack justify-content-end gap-2'>
						<button onClick={()=> {dispatch(clearFilters())}}
								disabled={activeFilters.length === 0}
								className={`btn btn-sm btn-outline-light border-gray-200 bg-light-hover text-primary-hover shadow-none rounded-pill`}>
							<span className='pe-2'><X size={16} /></span>
							<span>Clear Filters</span>
						</button>
					</div>
				</div>
			</div>

		</div>
    );
};

// Specifies the default values for props
NavbarTop.defaultProps = {
	search: true
};

// Typechecking With PropTypes
NavbarTop.propTypes = {
	search: PropTypes.bool,
};

export default NavbarTop;
