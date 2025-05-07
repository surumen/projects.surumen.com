import { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, Navbar, Container, Nav } from 'react-bootstrap';

import LogoIcon from '@/widgets/icons/LogoIcon'


const Sidebar = (props) => {
	const year = useMemo(() => new Date().getFullYear(), []);

	const rotatedStyle = useMemo(
		() => ({
			display: 'inline-block',
			transform: 'rotate(270deg)',
			transformOrigin: 'center',
		}),
		[]
	);

	return (
		<Navbar className='navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered navbar-vertical-aside-initialized'>
			<div className='navbar-vertical-container'>
				<Navbar.Brand href="/" className='navbar-brand d-flex justify-content-center navbar-brand px-3 mt-3'>
					<LogoIcon primary={'#377dff'} dark={'#1c232c'} />
				</Navbar.Brand>

				<div className='navbar-vertical-content'>
					<div className='navbar-nav nav-compact h-100'>
						<Nav className='nav nav-pills nav-vertical align-content-center h-100 py-6 mb-4'>
							<h1
								style={rotatedStyle}
								className='display-2 font-display fw-bolder text-body-secondary opacity-25 py-3 mb-0'>
								{year}
							</h1>
							<div className='nav-divider-step mt-auto'></div>
							<h1
								style={rotatedStyle}
								className='display-2 font-display fw-bolder text-body-secondary opacity-25 py-3 mb-0'>
								2015
							</h1>
						</Nav>
					</div>
				</div>
			</div>
		</Navbar>
	);
};

Sidebar.defaultProps = {
	className: null
};

Sidebar.propTypes = {
	className: PropTypes.string,
};


export default Sidebar;
