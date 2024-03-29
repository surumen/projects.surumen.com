// import node module libraries
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';


// import custom components
import DarkLightMode from './DarkLightMode';


const QuickMenu = () => {

    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

    return (
        <Fragment>
            <DarkLightMode className='' />
        </Fragment>
    );
}

export default QuickMenu;