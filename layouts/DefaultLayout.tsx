import React from 'react';

import { Sidebar, NavTop } from '@/widgets';

const DefaultLayout = (props) => {

	return (		
		<div className='d-flex flex-column flex-lg-row vh-100 gap-1'>
			<nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2">
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
