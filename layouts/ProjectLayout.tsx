// import node module libraries
import React, { useState } from 'react';

// import sub components
import { Sidebar, NavbarTop } from '@/widgets';

const ProjectLayout = (props) => {

    return (
        <div className='d-flex flex-column flex-lg-row h-lg-100'>
            <nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-0">
                <Sidebar className='py-2 py-md-1' />
            </nav>
            <div className='vstack vh-lg-100 bg-body flex-lg-fill overflow-x-auto position-relative'>
                {props.children}
            </div>
        </div>
    );
};
export default ProjectLayout;
