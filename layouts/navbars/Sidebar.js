// import node module libraries
import { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive';
import {
	Image,
	Navbar,
	Nav,
	Container,
	Form,
} from 'react-bootstrap';

// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';

const Sidebar = (props) => {
	const location = useRouter();

	const isMobile = useMediaQuery({ maxWidth: 767 });

	return (
		<Fragment>
			<Container className="container-fluid px-3 px-md-4 px-lg-6">
				<Navbar.Brand href="/" className="navbar-brand d-inline-block py-lg-1 mb-lg-5">
					<Image src="/images/icons/python.svg" alt="" className="logo-dark h-rem-8 h-rem-md-16" />
				</Navbar.Brand>
			</Container>
		</Fragment>
	);
};

export default Sidebar;
