import React, {useCallback, useContext} from 'react'
import {Link, NavLink, Outlet, useNavigate} from 'react-router-dom'
import AppContext from "../app.context"

const Layout = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    const onLogout = useCallback(() => {
        context.logout();
        navigate('/');
    }, [context.logout]);

    return (
        <div className={'layout'}>
            <div className="header">
                <div className="header__left">
                    <Link to={'/'}>CS Teachers Club</Link>
                </div>

                {context.authorized ? (
                    <div className="header__right">
                        <div className="header__right--buttons">
                            <NavLink to={'/courses'}>Courses</NavLink>
                            <NavLink to={'/my-courses'}>My courses</NavLink>
                        </div>

                        <div className="header__right--profile">
                            <span>John Doe</span>

                            <button type={'button'} onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="header__right">
                        <Link to={"/login"}>
                            Login
                        </Link>
                    </div>
                )}
            </div>

            <div className="content">
                <Outlet />
            </div>
        </div>
    )
};

export default Layout;
