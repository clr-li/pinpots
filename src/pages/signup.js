// Filename - signup.js
import React from 'react';
import Navbar from '../components/Navbar';
import SignupForm from '../components/Signup';

function SignupPage() {
    return (
        <React.StrictMode>
            <Navbar></Navbar>
            <SignupForm />
        </React.StrictMode>
    );
}

export default SignupPage;
