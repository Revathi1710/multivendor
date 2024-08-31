import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AllProducts = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            setUserData(data.data);
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        });
    }

    const fetchProducts = async () => {
      try {
        // Use the correct URL based on the location provided
        let url = 'http://localhost:5000/getProductsHome';
        if (location) {
          url = `http://localhost:5000/getLocationRelatedProduct/${location}`;
        }
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'ok') {
          setProducts(data.data);
          setMessage('');
        } else {
          setProducts([]);
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [location]);

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
      product_id: formData.get('id'),
      productPrice: formData.get('price'),
      vendorId: formData.get('vendorId'),
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
    };

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
      console.error("Error:", error);
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleView = (ProductId) => {
    window.location.href = `/ProductView/${ProductId}`;
  };

  return (
    <div className="container14 mt-4">
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-md-3 mb-4 productcardHome">
            <div className="card h-100" >
            
              {product.image ? (
                <img 
                  src={`http://localhost:5000/${product.image.replace('\\', '/')}`} 
                  className="card-img-top homeproductimage" 
                  alt={product.name}
                />
              ) : (
                <img 
                  src="path_to_default_image.jpg" 
                  className="card-img-top" 
                  alt="default"
                />
              )}
              <div className="card-body">
                <h5 className="card-title ellipsis2" onClick={() => handleView(product._id)}>{product.name}</h5>
                <form onSubmit={handleEnquiry}>
                  <input type="hidden" name="name" value={product.name} />
                  <input type="hidden" name="id" value={product._id} />
                  <input type="hidden" name="price" value={product.sellingPrice} />
                  <input type="hidden" name="vendorId" value={product.vendorId} />
                  <button type="submit" name="Enquiry" className="submit-btn">
                    <i className="fa fa-send-o"></i> Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
