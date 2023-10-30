// import node module libraries
import React, { Fragment, useState, useEffect } from 'react';

// import sub components
import Sidebar from './navbars/Sidebar';
import NavbarTop from './navbars/NavbarTop';

const HomeIndex = (props) => {

	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};	
	return (		
		<div className='d-flex flex-column flex-lg-row h-lg-100 gap-1'>
			<nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2">
				<Sidebar
					showMenu={showMenu}
					onClick={(value) => setShowMenu(value)}
				/>
			</nav>
			<div className='flex-lg-fill overflow-x-auto ps-lg-1 vstack vh-lg-100 position-relative'>
				<div className='d-none d-lg-flex py-3'>
					<NavbarTop
						data={{
							showMenu: showMenu,
							SidebarToggleMenu: ToggleMenu
						}}
					/>
				</div>
				<div className='flex-fill overflow-y-lg-auto scrollbar overflow-x-hidden bg-body rounded-top-4 rounded-top-start-lg-4 rounded-top-end-lg-0 border-top border-lg shadow-2'>
					{props.children}
				</div>
			</div>
		</div>
	);
};
export default HomeIndex;
