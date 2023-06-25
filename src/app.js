import React, {useEffect, useState} from 'react'
import AppContext from "./app.context"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import IndexScreen from "./screens"
import Layout from "./screens/layout"
import LoginScreen from "./screens/login"
import RegisterScreen from "./screens/register"
import CoursesScreen from "./screens/courses"
import MyCoursesScreen from "./screens/my-courses"

const App = () => {
    const [token, setToken] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    // set token on first page load. if authorized
    useEffect(() => {
        const token = localStorage.getItem('@auth_token');

        if(token) {
            login(token);
        }

        setLoading(false);
    }, []);

    // offline-login to webpage
    // sets token, authorized flag, and window.token for api further requests
    const login = (token) => {
        setToken(token);
        setAuthorized(true);
        localStorage.setItem('@auth_token', token);
        window.token = token;
    };

    // offline-logout
    // unsets token, window.token sets to empty string to avoid requests, invalidate authorize
    const logout = () => {
        setToken('');
        setAuthorized(false);
        localStorage.setItem('@auth_token', '');
        window.token = '';
    };

    return (
        <BrowserRouter>
            <AppContext.Provider value={{
                token,
                authorized,
                login,
                logout
            }}>
                {!loading && (
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path={"/"} element={<IndexScreen />} />
                            <Route path={"/login"} element={<LoginScreen />} />
                            <Route path={"/signup"} element={<RegisterScreen />} />
                            <Route path={"/courses"} element={<CoursesScreen />} />
                            <Route path={"/my-courses"} element={<MyCoursesScreen />} />
                        </Route>
                    </Routes>
                )}
            </AppContext.Provider>
        </BrowserRouter>
    );
};

export default App;
