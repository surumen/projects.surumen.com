// import node module libraries
import { Fragment } from 'react';
import PropTypes from "prop-types";
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive';
import { Image, Navbar, Container } from 'react-bootstrap';

const Sidebar = (props) => {
	const location = useRouter();

	const isMobile = useMediaQuery({ maxWidth: 767 });

	return (
		<Fragment>
			<Container className={`container-fluid px-3 px-md-4 px-lg-6 ${props.className}`}>
				<Navbar.Brand href="/" className="navbar-brand d-inline-block py-lg-1 mb-lg-5">
					<Image src={props.className ? '/images/icons/logo-light.svg' : '/images/icons/brain.svg'} alt="" className='h-rem-8 h-rem-md-16 logo-dark' />
					<Image src="/images/icons/logo-light.svg" alt="" className='h-rem-8 h-rem-md-16 logo-light' />
				</Navbar.Brand>
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
