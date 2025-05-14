import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, Nav } from 'react-bootstrap';
import { Linkedin, Person, Search, XLg, Github, MoonFill, Sun } from 'react-bootstrap-icons';

import useLocalStorage from '@/hooks/useLocalStorage';
import { changeSkin } from '@/store/appSlice';
import LogoIcon from '@/widgets/icons/LogoIcon';
import QuickMenu from '@/widgets/navbars/QuickMenu';


const NavTop = ({ showSearch, className }) => {
    const placeholder = useMemo(() => 'Ask me a question...', []);

    return (
        <Navbar className='navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-body'>
            <div className='navbar-nav-wrap'>
                <Navbar.Brand href="/" className='navbar-brand d-none'>
                    <LogoIcon primary={'#377dff'} dark={'#1c232c'} />
                </Navbar.Brand>

                <div className='navbar-nav-wrap-content-start'>
                    <div className='d-none d-md-block'>
                        {showSearch && (
                            <div className='input-group input-group-merge input-group-borderless navbar-input-group rounded'>
                                <div className='input-group-prepend input-group-text'>
                                    <Search size={12} className='me-1'/>
                                </div>
                                <input type='search' className='form-control focus rounded' placeholder={placeholder}/>
                                <a className='input-group-append input-group-text d-none'>
                                    <XLg size={12} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className='navbar-nav-wrap-content-end'>
                    <ul className='navbar-nav'>
                        <QuickMenu />
                    </ul>
                </div>
            </div>
        </Navbar>
    );
};

NavTop.defaultProps = {
    showSearch: false
};

NavTop.propTypes = {
    showSearch: PropTypes.bool,
    className: PropTypes.string,
};


export default NavTop;
