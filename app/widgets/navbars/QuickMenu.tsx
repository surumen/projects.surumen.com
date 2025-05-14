import { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Nav } from 'react-bootstrap'
import { Sun, MoonFill, Person, Linkedin } from 'react-bootstrap-icons'

import { changeSkin } from '@/store/appSlice'
import useLocalStorage from '@/hooks/useLocalStorage'
import useMounted from '@/hooks/useMounted'

type RootState = { app: { skin: 'light' | 'dark' } }

const QuickMenu = () => {
    const skin = useSelector((state: RootState) => state.app.skin)
    const dispatch = useDispatch()
    const hasMounted = useMounted()

    const { storageValue: storedSkin, setStorageValue } =
        useLocalStorage('skin', skin)

    useEffect(() => {
        if (storedSkin !== skin) {
            dispatch(changeSkin(storedSkin))
        }
    }, [storedSkin, skin, dispatch])

    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-bs-theme', skin)
    }, [skin])

    const toggleTheme = () => {
        setStorageValue(skin === 'light' ? 'dark' : 'light')
    }

    if (!hasMounted) return null

    return (
        <Fragment>
            <Nav.Link
                target="_blank"
                href="https://surumen.com"
                className="nav-item nav-link rounded-pill cursor-pointer"
            >
                <Person size={22} />
            </Nav.Link>
            <Nav.Link
                target="_blank"
                href="https://www.linkedin.com/in/mosessurumen"
                className="nav-item nav-link rounded-pill cursor-pointer"
            >
                <Linkedin size={18} />
            </Nav.Link>
            <Nav.Link
                onClick={toggleTheme}
                className="nav-item nav-link rounded-pill cursor-pointer"
            >
                {skin === 'dark' ? <MoonFill size={18} /> : <Sun size={24} />}
            </Nav.Link>
        </Fragment>
    )
}

export default QuickMenu
