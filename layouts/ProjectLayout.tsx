// import node module libraries
import React, { useState } from 'react';

// import sub components
import { NavTop, Sidebar } from '@/widgets';

const ProjectLayout = (props) => {

    return (
        <div className='d-flex flex-column flex-lg-row h-lg-100 gap-1'>
            <nav className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2">
                <Sidebar />
            </nav>
            <div className='vh-100'>
                <NavTop />
                <div className='main'>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default ProjectLayout;
