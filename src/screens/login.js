import React, {useContext, useState} from 'react'
import {login} from "../api"
import AppContext from "../app.context"
import {Link, useNavigate} from 'react-router-dom'
import ContentWrapper from "../components/content-wrapper"

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const context = useContext(AppContext);

    const onChangeUsername = (ev) => {
        setUsername(ev.target.value);
    };

    const onChangePassword = (ev) => {
        setPassword(ev.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if(username === '' || password === '') {
            return false;
        }

        setLoading(true);

        try {
            const response = await login({
                username,
                password
            });

            context.login(response.data.token);
            navigate('/');
        } catch(e) {
            if(typeof e.response !== 'undefined') {
                setError(e.response.data.message === 'Invalid login' ? 'Username or password not connect' : e.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const disabled = username === '' || password === '' || loading;

    return (
        <ContentWrapper>
            <section className={'login'}>
                <div className="login-block">
                    <div className="login-header">
                        <b>Login into webpage</b>
                        <span>Input your login and password to access your membership</span>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <div className="login-form">
                        <form method="POST" onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username"
                                       value={username}
                                       onChange={onChangeUsername}
                                       className="input"/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password"
                                       value={password}
                                       onChange={onChangePassword}
                                       className="input"/>
                            </div>

                            <div className="form-button">
                                <button type="submit" disabled={disabled} className="btn btn-success">
                                    Enter
                                </button>

                                <Link to={"/signup"}>
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </ContentWrapper>
    )
};

export default LoginScreen;
