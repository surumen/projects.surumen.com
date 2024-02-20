// import node module libraries
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Form, Modal } from 'react-bootstrap';

// import bootstrap icons
import { Search, SendFill } from 'react-bootstrap-icons';

// import sub components
import QuickMenu from '@/widgets/navbars/QuickMenu';

import { AllProjectsData } from '@/data/projects/AllProjectsData';
import Link from 'next/link';
import { Project } from '@/types';


const NavbarTop = (props) => {
	const [open, setOpen] = useState(false);
	const [Records, setRecords] = useState<Project[]>([]);

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

	return (
        <Fragment>
			{props.search ? (
				<Fragment>
					<Form className='flex-none'>
						<InputGroup
							className='input-group input-group-sm input-group-inline w-rem-64 rounded-pill shadow-none'>
							<InputGroup.Text className='input-group-text rounded-start-pill'>
								<Search size={16} className='me-2'/>
							</InputGroup.Text>
							<Form.Control onClick={() => displayModal()}
										  type='search'
										  className='form-control ps-0 rounded-end-pill'
										  placeholder='Search Projects...'
							/>
						</InputGroup>
					</Form>
					<div className='d-flex align-items-center gap-4 px-4 scrollable-x'>
						<div className='d-flex gap-2 text-xs'>
							<span className='text-heading fw-semibold'>Last updated:</span> <span className='text-muted'>June 24th, 2023</span>
						</div>
					</div>
				</Fragment>
			) : (<Fragment></Fragment>)}
			<div className='hstack flex-fill justify-content-end flex-nowrap gap-6 ms-auto px-6 px-xxl-8'>
				<QuickMenu/>
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
		</Fragment>
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
