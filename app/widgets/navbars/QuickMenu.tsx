import { Fragment, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Nav } from 'react-bootstrap'
import { Sun, MoonFill, Person, Linkedin } from 'react-bootstrap-icons'
import { useAppStore } from '@/store/store'
import useMounted from '@/hooks/useMounted'

const QuickMenu = () => {
    const { skin, changeSkin } = useAppStore()
    const hasMounted = useMounted()

    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-bs-theme', skin)
    }, [skin])

    const toggleTheme = () => {
        changeSkin(skin === 'light' ? 'dark' : 'light')
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
