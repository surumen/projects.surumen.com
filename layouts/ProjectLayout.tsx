// import node module libraries
import React, { useEffect, useState } from 'react';

// import sub components
import { Sidebar } from '@/widgets';
import { useMediaQuery } from 'react-responsive';

const ProjectLayout = (props) => {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        if (!isMobile) {
            document.body.classList.add('has-navbar-vertical-aside', 'navbar-vertical-aside-show',  'navbar-vertical-aside-compact-mini-mode', 'navbar-vertical-aside-compact-mode');
        } else {
            document.body.classList.remove('has-navbar-vertical-aside', 'navbar-vertical-aside-show',  'navbar-vertical-aside-compact-mini-mode', 'navbar-vertical-aside-compact-mode');
        }
    });

    return (
        <div className='d-flex flex-column flex-lg-row h-lg-100 gap-1'>
            <nav className={`${isMobile ? 'd-none' : 'flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2'}`}>
                <Sidebar />
            </nav>
            <div className='vh-100 vw-100'>
                {/* NavTop temporarily removed - uses Redux */}
                <div className='main'>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default ProjectLayout;
