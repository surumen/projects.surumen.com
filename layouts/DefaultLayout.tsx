import React, { useEffect } from 'react';

import { Sidebar, NavTop } from '@/widgets';
import { useMediaQuery } from 'react-responsive';

const DefaultLayout = (props) => {

	const isMobile = useMediaQuery({ maxWidth: 767 });

	useEffect(() => {
		if (!isMobile) {
			document.body.classList.add('has-navbar-vertical-aside', 'navbar-vertical-aside-show',  'navbar-vertical-aside-compact-mini-mode', 'navbar-vertical-aside-compact-mode');
		} else {
			document.body.classList.remove('has-navbar-vertical-aside', 'navbar-vertical-aside-show',  'navbar-vertical-aside-compact-mini-mode', 'navbar-vertical-aside-compact-mode');
		}
	});

	return (		
		<div className='d-flex flex-column flex-lg-row vh-100 gap-1'>
			<nav className={`'d-sm-none d-block flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2'}`}>
				<Sidebar />
			</nav>
			<div className='vh-100'>
				<NavTop />
				<div className='main'>
					<div className='content container-fluid'>
						{props.children}
					</div>
				</div>
			</div>
		</div>
	);
};
export default DefaultLayout;
