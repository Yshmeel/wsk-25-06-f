import React, {useContext, useRef, useState} from 'react'
import {register} from "../api"
import {useNavigate} from "react-router-dom"
import AppContext from "../app.context"
import ContentWrapper from "../components/content-wrapper"

const RegisterScreen = () => {
    // @todo refactor
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [teacherID, setTeacherID] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [warning, setWarning] = useState('');
    const [loading, setLoading] = useState(false);

    const profilePhotoRef = useRef(null);

    const navigate = useNavigate();
    const context = useContext(AppContext);

    const onChangeFirstName = (ev) => {
        setFirstName(ev.target.value);
        setWarning('');
    };

    const onChangeLastName = (ev) => {
        setLastName(ev.target.value);
        setWarning('');
    };

    const onChangeEmail = (ev) => {
        setEmail(ev.target.value);
        setWarning('');
    };

    const onChangeTeacherID = (ev) => {
        setTeacherID(ev.target.value);
        setWarning('');
    };

    const onChangeUsername = (ev) => {
        setUsername(ev.target.value);
        setWarning('');
    };

    const onChangePassword = (ev) => {
        setPassword(ev.target.value);
        setWarning('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // validation
        if(username === '' || password === '' || firstName === '' || lastName === '' || teacherID === '' || email === '') {
            setWarning('Missing fields');
            return false;
        }

        if(email.search('@') === -1) {
            setWarning('Wrong email address');
            return false;
        }

        // read base64 of selected photo
        // if file was not selected, returns empty string as value
        const photoBase64 = await (async function() {
            if(!profilePhotoRef.current.value) {
                return '';
            }

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(profilePhotoRef.current.files[0]);

                reader.onload = function () {
                    resolve(reader.result);
                };

                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            });
        }());

        try {
            // photobase64 contains type, that does not being replaced on backend. hardcode
            const response = await register({
                username,
                password,
                photo: photoBase64.replace('data:image/png;base64,', ''),
                firstname: firstName,
                lastname: lastName,
                teacher_id: teacherID,
                email
            });

            context.login(response.data.token);
            navigate('/');
        } catch(e) {
            if(typeof e.response !== 'undefined') {
                setWarning(e.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentWrapper>
            <section className={'register'}>
                <div className="register-block">
                    <div className="register-header">
                        <b>Sign up</b>
                        <span>Create your own account with membership. For free!</span>
                    </div>

                    {warning && (
                        <div className="register-warning">
                            {warning}
                        </div>
                    )}

                    <div className="register-form">
                        <form method="POST" onSubmit={onSubmit}>
                            <div className="register-form-group">
                                <b>Profile info</b>

                                <div className="form-group">
                                    <label htmlFor="firstname">Firstname *</label>
                                    <input type="text" id="firstname" name="firstname"
                                           value={firstName}
                                           onChange={onChangeFirstName}
                                           className="input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastname">Lastname *</label>
                                    <input type="text" id="lastname" name="lastname"
                                           value={lastName}
                                           onChange={onChangeLastName}
                                           className="input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input type="text" id="email" name="email"
                                           value={email}
                                           onChange={onChangeEmail}
                                           className="input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="teacherID">Teacher ID *</label>
                                    <input type="text" id="teacherID" name="teacherID"
                                           value={teacherID}
                                           onChange={onChangeTeacherID}
                                           className="input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="profilePhoto">Profile Photo *</label>
                                    <input type="file" id="profilePhoto" name="profilePhoto"
                                           ref={profilePhotoRef}
                                           className="input"/>
                                </div>
                            </div>

                            <div className="register-form-group">
                                <b>Login</b>

                                <div className="form-group">
                                    <label htmlFor="username">Username *</label>
                                    <input type="text" id="username" name="username"
                                           value={username}
                                           onChange={onChangeUsername}
                                           className="input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input type="text" id="password" name="password"
                                           value={password}
                                           onChange={onChangePassword}
                                           className="input"/>
                                </div>
                            </div>

                            <div className="form-button">
                                <button type="submit" disabled={loading} className="btn btn-success">
                                    Enter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </ContentWrapper>
    )
};

export default RegisterScreen;
