// import node module libraries
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive';
import { Image, Navbar, Container } from 'react-bootstrap';

import useScroll from '@/hooks/useScroll';

import LogoIcon from '@/widgets/icons/LogoIcon'


const Sidebar = (props) => {
	const location = useRouter();
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const scrollPosition = useScroll();

	return (
		<Fragment>
			<Container className={`container-fluid justify-content-center align-content-center px-3 ${props.className}`}>
				<Navbar.Brand href="/" className="navbar-brand d-flex justify-content-center py-lg-1 mb-lg-5">
					<LogoIcon primary={'#377dff'} dark={'#1c232c'} />
				</Navbar.Brand>

				<div className='collapse navbar-collapse overflow-hidden py-5'>
					<h1
						style={{transform: 'rotate(270deg)', transformOrigin: 'center', marginTop: '3rem'}}
						className='display-4 font-display fw-bolder text-body-secondary opacity-25'>
						2024
					</h1>
					<div className='nav-divider-step mt-auto'></div>
					<h1
						style={{transform: 'rotate(270deg)', transformOrigin: 'center', marginBottom: '2rem'}}
						className='display-4 font-display fw-bolder text-body-secondary opacity-25'>
						2015
					</h1>
				</div>
			</Container>

		</Fragment>
	);
};

// Specifies the default values for props
Sidebar.defaultProps = {
	className: null
};

// Typechecking With PropTypes
Sidebar.propTypes = {
	className: PropTypes.string,
};


export default Sidebar;
