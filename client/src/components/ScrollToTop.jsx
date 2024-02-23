import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//to scroll automatic on top of the page
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default ScrollToTop;
