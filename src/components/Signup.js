// Filename - Signup.js
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HOSTNAME } from '../constants';

const USER_REGEX = /^[a-z][a-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupForm() {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidUser(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setErrMsg('');
    }, [username, pwd]);

    async function handleSubmit(e) {
        e.preventDefault();
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg('Invalid Entry');
            return;
        }

        try {
            await axios
                .post(`${HOSTNAME}/signup`, {
                    username: username,
                    email,
                    password: pwd,
                })
                .then(res => {
                    if (res.status === 201) {
                        setUser('');
                        setPwd('');
                        setEmail('');
                        setSuccess(true);
                    } else {
                        setErrMsg(res.data);
                    }
                });
        } catch (e) {
            setErrMsg('Registration Failed');
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login.html">Login Page</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p
                        ref={errRef}
                        className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:&nbsp;
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={validUser ? 'valid' : 'hide'}
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={validUser || !username ? 'hide' : 'invalid'}
                            />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={e => setUser(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validUser ? 'false' : 'true'}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p
                            id="uidnote"
                            className={
                                userFocus && username && !validUser ? 'instructions' : 'offscreen'
                            }
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            &nbsp; 4 to 24 characters.
                            <br />
                            Must begin with a letter.
                            <br />
                            Lowercase letters, numbers, underscores, and hyphens allowed.
                        </p>

                        <label htmlFor="password">
                            Password:&nbsp;
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={validPwd ? 'valid' : 'hide'}
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={validPwd || !pwd ? 'hide' : 'invalid'}
                            />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={e => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p
                            id="pwdnote"
                            className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            &nbsp; 8 to 24 characters.
                            <br />
                            Must include uppercase and lowercase letters, a number and a special
                            character.
                            <br />
                            Allowed special characters: <span aria-label="exclamation mark">
                                !
                            </span>{' '}
                            <span aria-label="at symbol">@</span>{' '}
                            <span aria-label="hashtag">#</span>{' '}
                            <span aria-label="dollar sign">$</span>{' '}
                            <span aria-label="percent">%</span>
                        </p>
                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={validEmail ? 'valid' : 'hide'}
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={validEmail || !email ? 'hide' : 'invalid'}
                            />
                        </label>
                        <input
                            type="text"
                            id="email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? 'false' : 'true'}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />

                        <button disabled={!validUser || !validPwd || !validEmail ? true : false}>
                            Sign Up
                        </button>
                    </form>
                    <p>
                        Already registered?
                        <br />
                        <span className="line">
                            <Link to="/login.html">Login Page</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
}

export default SignupForm;
