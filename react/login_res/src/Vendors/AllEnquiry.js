import React, { useState, useEffect } from 'react';
import Sidebar from './Vendorsidebar '; // Ensure the correct path
import '../SuperAdmin/addcategory.css';
import './table.css';

const AllEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    fetch('http://localhost:5000/getVendorEnquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        setEnquiries(data.data);
      } else {
        console.error('Error:', data.message);
        setMessage('Error fetching enquiries: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setMessage('Error fetching enquiries');
    });
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="" style={{ marginLeft: '250px' }}>
        <div className="title">
          <h2>All Enquiries</h2>
        </div>
        {message && <p>{message}</p>}
        {enquiries.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Customer Name</th>
                <th>Customer Number</th>
                <th>Product Price</th>
              
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id}>
                  <td>{enquiry.productname}</td>
                  <td>{enquiry.Username}</td>
                  <td>{enquiry.UserNumber}</td>
                  <td>{enquiry.productPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Enquiries found</p>
        )}
      </div>
    </div>
  );
};

export default AllEnquiry;
