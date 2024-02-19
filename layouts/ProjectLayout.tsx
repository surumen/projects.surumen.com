// import node module libraries
import React, { useState } from 'react';

// import sub components
import { Sidebar, NavbarTop } from '@/widgets';

const ProjectLayout = (props) => {

    return (
        <div className='d-flex flex-column flex-lg-row h-lg-100'>
            <nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-0">
                <Sidebar
                    className={'bg-charcoal-gray-600 py-2 py-md-1'}
                />
            </nav>
            <div className='flex-lg-fill overflow-x-auto vstack vh-lg-100 position-relative'>
                <div className='d-none d-lg-flex py-3 bg-light border-bottom'>
                    <NavbarTop search={false}/>
                </div>
                <div className='flex-fill overflow-y-lg-auto scrollbar overflow-x-hidden bg-body'>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default ProjectLayout;
