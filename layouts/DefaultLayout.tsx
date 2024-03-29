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
			<div className='flex-lg-fill overflow-x-auto ps-lg-1 vstack vh-lg-100 position-relative'>
				<div className='d-none d-lg-flex py-3'>
					<NavbarTop />
				</div>
				<div className='flex-fill overflow-y-lg-auto scrollbar overflow-x-hidden bg-body rounded-top-4 rounded-top-start-lg-4 rounded-top-end-lg-0 border-top border-lg shadow-2'>
					{props.children}
				</div>
			</div>
		</div>
	);
};
export default DefaultLayout;
