import React, {useEffect, useRef, useState} from 'react'

const ContentWrapper = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    const tRef = useRef(null);

    // timeout for animation
    // clears timeout on page unmount to avoid React error
    useEffect(() => {
        tRef.current = setTimeout(() => {
            setLoaded(true);
        }, 100);

        return () => {
            window.clearTimeout(tRef.current);
        }
    }, [])

    return (
        <div className={'content-wrapper ' + (loaded ? 'loaded' : '')}>
            {children}
        </div>
    )
};

export default ContentWrapper;
