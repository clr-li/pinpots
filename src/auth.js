// Filename - auth.js
import { jwtDecode } from 'jwt-decode';
import { HOSTNAME } from './constants';

export async function fetchProtectedData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${HOSTNAME}/protected`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching protected data:', error);
        throw error; // Rethrow the error if needed
    }
}

// Function to get the user info from JWT stored in localStorage
export function getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        // Decode the JWT
        const decodedToken = jwtDecode(token);
        return decodedToken; // Contains user info such as id, username, etc.
    } catch (error) {
        throw new Error('Invalid token');
    }
}
