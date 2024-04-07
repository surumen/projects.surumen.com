// import node module libraries
import React from 'react';

// import sub components
import { Sidebar, NavbarTop } from '@/widgets';

const DefaultLayout = (props) => {

	return (		
		<div className='d-flex flex-column flex-lg-row h-lg-100 gap-1'>
			<nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2">
				<Sidebar />
			</nav>
			<div className='bg-body shadow-2 flex-lg-fill overflow-x-auto vstack vh-lg-100 position-relative'>
				<NavbarTop />
				<div className='flex-fill overflow-y-lg-auto scrollbar overflow-x-hidden'>
					{props.children}
				</div>
			</div>
		</div>
	);
};
export default DefaultLayout;
