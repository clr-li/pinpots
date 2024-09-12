// Filename - search.js
import React from 'react';
import Navbar from '../components/Navbar';
import Search from '../components/Search';

function SearchPage() {
    return (
        <React.StrictMode>
            <Navbar></Navbar>
            <Search />
        </React.StrictMode>
    );
}

export default SearchPage;
