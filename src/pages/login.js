// Filename - login.js
import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/Login';

function LoginPage() {
  return (
    <React.StrictMode>
      <Navbar></Navbar>
      <LoginForm />
    </React.StrictMode>
  );
}

export default LoginPage;
