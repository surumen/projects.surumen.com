// import node module libraries
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

// import bootstrap icons
import { InputGroup, Form, Modal } from 'react-bootstrap';
import { Search, SendFill, X } from 'react-bootstrap-icons';

// import sub components
import QuickMenu from '@/widgets/navbars/QuickMenu';
import useProjects from '@/hooks/useProjects';
import { setFilter, removeFilter, clearFilters } from '@/store/projectsSlice'

import { AllProjectsData } from '@/data/projects/AllProjectsData';
import { Project } from '@/types';


const NavbarTop = (props) => {
	const [open, setOpen] = useState(false);
	const [Records, setRecords] = useState<Project[]>([]);
	const dispatch = useDispatch();
	const { filters, activeFilters } = useProjects();

	const displayModal = () => {
		setOpen(true);
	}

	const searchData = (params) => {
		const results = AllProjectsData.filter((project) => {
		  return project.title.toLowerCase().includes(params.toLowerCase())
			  || project.technologyAreas.join(' ').toLowerCase().includes(params.toLowerCase())
			  || project.shortDescription.toLowerCase().includes(params.toLowerCase());
		}).slice(0, 6);
		// @ts-ignore
		setRecords(params ? results : []);
	}

	const onHide = () => {
		setOpen(false);
		setRecords([]);
	}

	const addFilter = (category: string) => {
		if (activeFilters.indexOf(category) === -1) {
			dispatch(setFilter(category));
		} else {
			dispatch(removeFilter(category));
		}
	};

	const isSelectedFilter = (category: string) => {
		return activeFilters.indexOf(category) > -1;
	};

	const filterOptions = filters.map((category, index) => {
		return (
			<button key={index} onClick={()=> {addFilter(category)}}
					className={`btn btn-sm rounded-pill ${isSelectedFilter(category)  ? `btn-primary` : `btn-outline-primary`}`}>
				{category}
				{isSelectedFilter(category) ? (
					<X size={14} className='ms-2 me-n1' />
				) : (<span></span>)}
			</button>
		);
	});

	return (
		<div className='d-none d-lg-block border-bottom p-5 pb-4'>
			<div className='d-none d-lg-flex'>
				{props.search ? (
					<Fragment>
						<Form className='flex-none'>
							<InputGroup
								className='input-group input-group-sm input-group-inline bg-body-secondary ps-2 w-rem-80 h-rem-10 rounded-pill shadow-none'>
								<InputGroup.Text className='input-group-text rounded-start-pill bg-transparent border-0'>
									<Search size={12} className='me-2'/>
								</InputGroup.Text>
								<Form.Control onClick={() => displayModal()}
											  type='search'
											  className='form-control rounded-end-pill bg-transparent border-0'
											  placeholder='Search projects, skills, interests...'
								/>
							</InputGroup>
						</Form>
						<div className='d-flex d-none align-items-center gap-4 px-4 scrollable-x'>
							<div className='d-flex gap-2 text-xs'>
								<span className='text-heading fw-semibold'>Last updated:</span> <span className='text-muted'>June 24th, 2023</span>
							</div>
						</div>
					</Fragment>
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

			<Modal
				size={'lg'}
				contentClassName='overflow-hidden'
				show={open} onHide={() => onHide()}
				centered={Records.length === 0}
			>
				<Modal.Body>
					<div className='vstack gap-6'>
						<Form className='d-flex flex-wrap gap-1 gap-sm-2'>
							<Form.Control autoFocus={true}
										  type='search'
										  className='form-control rounded shadow-none'
										  placeholder='Search projects, skills, interests ...'
										  onChange={(e) => {
											  searchData(e.target.value);
										  }}
							/>
						</Form>
						<div className='vstack gap-10'>
							{Records.map((record, index) => {
								return (
									<div key={index}>
										<div className='d-flex align-items-center gap-3'>
											<div className='icon icon-shape rounded-circle icon-sm flex-none w-rem-10 h-rem-10 text-sm bg-primary bg-opacity-25 text-primary'>
												<SendFill size={16} />
											</div>
											<div>
												<Link target={'_blank'} href={`/project/${record.slug}`}>
													<h6 className='progress-text mb-1 d-block'>{record.title}</h6>
													<p className='text-muted text-truncate text-xs mw-read'>{record.shortDescription}</p>
												</Link>
											</div>
											<div className='text-end ms-auto'>
												<span className='badge bg-white rounded-pill text-xs text-muted border'>{record.technologyAreas[0]}</span>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</Modal.Body>
			</Modal>
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
