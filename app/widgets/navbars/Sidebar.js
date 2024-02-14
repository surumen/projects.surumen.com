// import node module libraries
import { Fragment } from 'react';
import PropTypes from "prop-types";
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive';
import { Image, Navbar, Container } from 'react-bootstrap';

import useScroll from 'app/hooks/useScroll';


const Sidebar = (props) => {
	const location = useRouter();
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const scrollPosition = useScroll();

	return (
		<Fragment>
			<Container style={{minHeight: 'auto'}} className={`container-fluid px-3 px-md-4 px-lg-6 ${props.className}`}>
				<Navbar.Brand href="/" className="navbar-brand d-inline-block py-lg-1 mb-lg-5">
					<Image src={props.className ? '/images/icons/logo-light.svg' : '/images/icons/logo-dark.svg'} alt="" className='h-rem-8 h-rem-md-16 logo-dark' />
					<Image src="/images/icons/logo-light.svg" alt="" className='h-rem-8 h-rem-md-16 logo-light' />
				</Navbar.Brand>
			</Container>
			<div className="hstack gap-0 justify-content-end ps-3">
				<h1
					style={{transform: 'rotate(270deg)', transformOrigin: 'center'}}
					className='display-4 pt-10 font-display fw-bolder text-gray-200'
				>
					2023
				</h1>
				<h2
					id='navigation-dot'
					className={`text-limit text-muted m-0 p-0 position-absolute top-${scrollPosition}`}
				>•</h2>
			</div>

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
