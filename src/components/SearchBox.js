// Filename - SearchBox.js
import React, { useState } from 'react';
import '../styles/search.css';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';

function SearchBox(props) {
    const { setSelectPosition } = props;
    const [searchText, setSearchText] = useState('');
    const [listPlace, setListPlace] = useState([]);

    const handleSearchSubmit = e => {
        e.preventDefault();
        // Search
        const params = {
            q: searchText,
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 0,
        };
        const queryString = new URLSearchParams(params).toString();
        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };
        fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setListPlace(JSON.parse(result));
            })
            .catch(err => console.log('err: ', err));
    };

    return (
        <div className="search-box-wrapper">
            <div className="search-box-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        className="search-input"
                        placeholder="Enter location name"
                        value={searchText}
                        onChange={event => setSearchText(event.target.value)}
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>
            {listPlace.length > 0 && (
                <ul className="search-results-list">
                    {listPlace.map(item => (
                        <li
                            key={item?.place_id}
                            onClick={() => {
                                setSelectPosition(item);
                                setListPlace([]); // Clear the list to hide it
                            }}
                            className="list-item"
                        >
                            <img src="./marker.png" alt="Marker icon" className="marker-icon" />
                            <span>{item?.display_name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBox;
