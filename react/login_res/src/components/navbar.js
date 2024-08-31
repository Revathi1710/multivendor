import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

import logo from '../icons/aristoslogo.png'; // Adjust path if needed
import shop from '../icons/shopping-cart.png'; // Adjust path if needed
import sell from '../icons/shop.png'; // Adjust path if needed
import help from '../icons/question.png'; // Adjust path if needed
import userIcon from '../icons/user1.png'; // Adjust path if needed

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad']; // Add more cities as needed

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');

        if (!userId && !vendorId) return;

        const response = await fetch('http://localhost:5000/getName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'ok' && result.data && result.data.fname) {
          setUserName(result.data.fname);
        } else {
          console.error('Error in API response:', result.message || 'No name found');
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    // You can also trigger an API call or update based on the selected city here
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    setSelectedCity(searchLocation || 'All Cities');
  }, []);

  return (
    <nav className="navbar">
      <div className="container1">
        <div className="row">
          <div className="col-sm-2">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="Logo" className="navbar-logo" />
            </Link>
          </div>
          <div className="col-sm-2">
            <select className="form-select" value={selectedCity} onChange={handleCityChange}>
              <option value="All Cities">All Cities</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-3">
            <form className="d-flex mx-auto my-2 mt-2">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn searchheader"
                type="submit"
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="col-sm-4">
            <ul className="menulist">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <img src={shop} alt="Shopping" className="iconsheader" />
                  Shopping
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Vendor/Signup" className="nav-link">
                  <img src={sell} alt="Sell" className="iconsheader" />
                  Sell
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendors" className="nav-link">
                  <img src={help} alt="Help" className="iconsheader" />
                  Help
                </Link>
              </li>
              <li className="nav-item">
                <img src={userIcon} alt="User" className="iconsheader" />
                {userName ? (
                  <Link to="/UserDetails" className="nav-link">
                    Welcome, {userName}
                  </Link>
                ) : (
                  <Link to="/signup" className="nav-link">
                    Login/Signup
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
