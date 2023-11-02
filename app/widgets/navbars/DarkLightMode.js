// import node module libraries
import Link from 'next/link'
import { Fragment, useEffect } from 'react'
import { Form, Image } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

// import bootstrap icons
import { Sun, MoonFill, Moon } from 'react-bootstrap-icons';

// import chat actions from Redux chatSlice
import { changeSkin } from 'app/store/appSlice'

// import required hook
import useLocalStorage from 'app/hooks/useLocalStorage';

const DarkLightMode = ({ className }) => {

    // Redux state and dispatch
    const defaultSkin = useSelector((state) => state.app.skin)
    const dispatch = useDispatch()

    const {
		storageValue,
		setStorageValue,
		getStorageValue
	} = useLocalStorage("skin",defaultSkin);
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', getStorageValue('skin','light'));
        document.querySelector('html').setAttribute('data-bs-theme', getStorageValue('skin','light'));
        dispatch(changeSkin(storageValue));
    }, [storageValue]);

    const changeColorMode = () => {
        setStorageValue(storageValue === 'light' ? 'dark' : 'light');
        dispatch(changeSkin(storageValue));
    }
    return (
        <Fragment>
            <Link onClick={changeColorMode} href='#' className='nav-item nav-link rounded-pill d-none d-lg-block'>
                {storageValue === 'dark' ? (
                    <MoonFill size={18} />
                ) : (
                    <Sun size={24} />
                )}
            </Link>
        </Fragment>
    )
}

export default DarkLightMode