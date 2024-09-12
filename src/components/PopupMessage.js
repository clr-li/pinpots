// Filename: PopupMessage.js
import React, { useState, useEffect } from 'react';
import '../index.css';

const PopupMessage = ({ message, type = 'success' }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Hide the message after 3 seconds
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        // Clean up the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    const messageClass = type === 'error' ? 'error-message' : 'success-message';

    return <div className={`${messageClass} ${!visible ? 'hide' : ''}`}>{message}</div>;
};

export default PopupMessage;
