// import node module libraries
import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive';

// import bootstrap icons
import { Sun, MoonFill, Person, Linkedin } from 'react-bootstrap-icons';

// import actions from Redux appSlice
import { changeSkin } from '@/store/appSlice'

// import required hook
import useLocalStorage from '@/hooks/useLocalStorage';


const QuickMenu = () => {

    const defaultSkin = useSelector((state: any) => state.app.skin)
    const dispatch = useDispatch()

    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

    const {
        storageValue,
        setStorageValue,
        getStorageValue
    } = useLocalStorage("skin",defaultSkin);
    useEffect(() => {
        // @ts-ignore
        document.querySelector('html').setAttribute('data-theme', getStorageValue('skin','light'));
        // @ts-ignore
        document.querySelector('html').setAttribute('data-bs-theme', getStorageValue('skin','light'));
        dispatch(changeSkin(storageValue));
    }, [storageValue]);

    const changeColorMode = () => {
        setStorageValue(storageValue === 'light' ? 'dark' : 'light');
        dispatch(changeSkin(storageValue));
    }

    return (
        <Fragment>
            <a target='_blank' href='https://surumen.com' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                <Person size={20} />
            </a>
            <a target='_blank' href='https://www.linkedin.com/in/mosessurumen' className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                <Linkedin size={18} />
            </a>
            <div onClick={changeColorMode} className='nav-item nav-link rounded-pill d-none d-lg-block cursor-pointer'>
                {storageValue === 'dark' ? (
                    <MoonFill size={18} />
                ) : (
                    <Sun size={24} />
                )}
            </div>
        </Fragment>
    );
}

export default QuickMenu;