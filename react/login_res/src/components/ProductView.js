import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import './productview.css';
import axios from 'axios';

const ProductView = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // State for displaying messages

  // Simulating fetching userData from localStorage or any other source
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ProductView/${id}`);
        const data = response.data;

        if (data.status === 'ok') {
          setProduct(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('An error occurred: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleEnquiry = async (e) => {
    e.preventDefault();

    if (!userData) {
      window.localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const enquiryData = {
      productname: formData.get('name'),
      product_id: id, // Use the product ID from useParams
      productPrice: product.sellingPrice,
      vendorId: product.vendorId._id,
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
    };

    console.log("Enquiry Data:", enquiryData); // Debugging line

    try {
      const response = await axios.post('http://localhost:5000/sendEnquiry', enquiryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;

      if (data.status === 'ok') {
        setMessage('Enquiry sent successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error); // Debugging line
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container1 mt-4">
        {product ? (
          <div className="row">
            <div className="col-md-9 productDetails">
              <div className="row productrow">
                <div className="col-md-5">
                  {product.image ? (
                    <img
                      src={`http://localhost:5000/${product.image.replace('\\', '/')}`}
                      className="img-fluid"
                      alt={product.name}
                    />
                  ) : (
                    <img
                      src="path_to_default_image.jpg"
                      className="img-fluid"
                      alt="default"
                    />
                  )}
                </div>
                <div className="col-md-7">
                  <h3>{product.name}</h3>
                  <hr />
                  <h4>Price: ₹{product.sellingPrice}</h4>
                  <p>{product.smalldescription}</p>
                  <form onSubmit={handleEnquiry}>
                    <button className="btn btn-primary">Send Enquiry</button>
                  </form>
                  {message && <p>{message}</p>}
                  {/* Add more product details or actions here */}
                </div>
              </div>
            </div>
            <div className="col-md-3 sellerDetails">
              <h3>Seller Details</h3>
              {product.vendorId ? (
                <>
                  <p>Name: {product.vendorId.fname}</p>
                  <p>Company: {product.vendorId.businessName}</p>
                  <p>Email: {product.vendorId.email}</p>
                  <p>Contact Number: {product.vendorId.number}</p>
                </>
              ) : (
                <p>No vendor details available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Product not found.</p>
        )}
        <div className='productOverview mt-4'>
          <h3>Product Overview</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
