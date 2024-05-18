// import node module libraries
import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive';

// import bootstrap icons
import { Nav } from 'react-bootstrap';
import { Sun, MoonFill, Person, Linkedin } from 'react-bootstrap-icons';

// import actions from Redux appSlice
import { changeSkin } from '@/store/appSlice'

// import required hook
import useLocalStorage from '@/hooks/useLocalStorage';
import useMounted from "@/hooks/useMounted";


const QuickMenu = () => {

    const defaultSkin = useSelector((state: any) => state.app.skin);
    const dispatch = useDispatch();
    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

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

    if(!hasMounted) return null;

    return (
        <Fragment>
            <Nav.Link target='_blank' href='https://surumen.com' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                <Person size={22} />
            </Nav.Link>
            <Nav.Link target='_blank' href='https://www.linkedin.com/in/mosessurumen' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                <Linkedin size={18} />
            </Nav.Link>
            <Nav.Link onClick={changeColorMode} className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                {storageValue === 'dark' ? (
                    <MoonFill size={18} />
                ) : (
                    <Sun size={24} />
                )}
            </Nav.Link>
        </Fragment>
    );
}

export default QuickMenu;