import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/form.css';
import { HOSTNAME } from '../constants';

function LoginForm() {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${HOSTNAME}/login-user`, {
        username: username,
        password: pwd,
      });

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        setUser('');
        setPwd('');
        setSuccess(true);
      } else {
        setErrMsg('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        // If the server responded with a status other than 2xx
        if (error.response.status === 400) {
          console.log(error.response);
          console.log(error);
          setErrMsg('Invalid username or password.');
        } else if (error.response.status === 500) {
          console.log(error.response);
          console.log(error);
          setErrMsg('Server error. Please try again later.');
        } else {
          setErrMsg('An unexpected error occurred.');
        }
      } else {
        // If the request never left (network error)
        setErrMsg('Unable to connect to the server. Please check your internet connection.');
      }
      errRef.current.focus(); // Focus on the error message
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="/">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              className="login-input"
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={e => setUser(e.target.value)}
              value={username}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              className="login-input"
              type="password"
              id="password"
              onChange={e => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <a href="/signup.html">Sign Up Page</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
}

export default LoginForm;
