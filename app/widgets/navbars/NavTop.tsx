import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, Nav } from 'react-bootstrap';
import { Linkedin, Person, Search, XLg, Github, MoonFill, Sun } from 'react-bootstrap-icons';

import useLocalStorage from '@/hooks/useLocalStorage';
import { changeSkin } from '@/store/appSlice';
import LogoIcon from '@/widgets/icons/LogoIcon';


const NavTop = (props) => {
    const placeholder = useMemo(() => 'Search projects, skills, technologies...', []);

    const defaultSkin = useSelector((state: any) => state.app.skin);
    const dispatch = useDispatch();

    const {
        storageValue,
        setStorageValue,
        getStorageValue
    } = useLocalStorage('skin', defaultSkin);
    useEffect(() => {
        const element = document.querySelector('html');
        if (element != null) {
            element.setAttribute('data-theme', getStorageValue('skin','light'));
            element.setAttribute('data-bs-theme', getStorageValue('skin','light'));
            dispatch(changeSkin(storageValue));
        }
    }, [dispatch, getStorageValue, storageValue]);

    const changeColorMode = () => {
        setStorageValue(storageValue === 'light' ? 'dark' : 'light');
        dispatch(changeSkin(storageValue));
    }

    return (
        <Navbar className='navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered'>
            <div className='navbar-nav-wrap'>
                <Navbar.Brand href="/" className='navbar-brand d-none'>
                    <LogoIcon primary={'#377dff'} dark={'#1c232c'} />
                </Navbar.Brand>

                <div className='navbar-nav-wrap-content-start'>
                    <div className='d-none d-lg-block'>
                        <div className='input-group input-group-merge input-group-borderless input-group-hover-light navbar-input-group'>
                            <div className='input-group-prepend input-group-text'>
                                <Search size={12} className='me-1'/>
                            </div>
                            <input type='search' className='form-control focus rounded' placeholder={placeholder}/>
                            <a className='input-group-append input-group-text'>
                                <XLg size={12} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className='navbar-nav-wrap-content-end'>
                    <ul className='navbar-nav'>
                        <Nav.Link target='_blank' href='https://surumen.com' className='nav-item nav-link rounded-pill d-none d-sm-inline-block cursor-pointer'>
                            <Person size={22} />
                        </Nav.Link>
                        <Nav.Link target='_blank' href='https://www.linkedin.com/in/mosessurumen' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                            <Linkedin size={18} />
                        </Nav.Link>
                        {/*<Nav.Link target='_blank' href='https://github.com/surumen' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>*/}
                        {/*    <Github size={18} />*/}
                        {/*</Nav.Link>*/}
                        <Nav.Link onClick={changeColorMode} className='nav-item nav-link rounded-pill d-none d-sm-inline-block cursor-pointer'>
                            {storageValue === 'dark' ? (
                                <MoonFill size={18} />
                            ) : (
                                <Sun size={24} />
                            )}
                        </Nav.Link>
                    </ul>
                </div>
            </div>
        </Navbar>
    );
};

NavTop.defaultProps = {
    className: null
};

NavTop.propTypes = {
    className: PropTypes.string,
};


export default NavTop;
