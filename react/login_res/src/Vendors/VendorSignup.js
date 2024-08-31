import React, { Component } from 'react';
import Navbar from '../components/navbar';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      email: "",
      number: "",
      password: "",
      cpassword: "",
      verifyButton: false,
      verifyOtp: false,
      Otp: "",
      emailOtp: "",
      otpSent: false,
      emailOtpVerified: false,
      formSubmitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendOtp = this.handleSendOtp.bind(this);
    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.finalSubmit = this.finalSubmit.bind(this);
  }

  handleSendOtp() {
    const { email } = this.state;

    fetch("http://localhost:5000/Vendorsend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({ otpSent: true });
        alert('OTP sent successfully!');
      } else {
        alert('Error sending OTP');
      }
    })
    .catch(err => console.error('Error:', err));
  }

  handleVerifyOtp() {
    const { email, emailOtp } = this.state;
    console.log("Sending OTP verification request:", { email, emailOtp }); // Add this line

    fetch("http://localhost:5000/VendorVerify-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp: emailOtp })
    })
    .then(res => {
        console.log("OTP verification response status:", res.status); // Log response status
        if (res.status === 200) {
            this.setState({ emailOtpVerified: true }, this.finalSubmit);
        } else {
            alert('Invalid OTP');
        }
    })
    .catch(err => console.error('Error:', err));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password, cpassword } = this.state;

    if (!email || !password || !cpassword) {
      alert('Please fill in all required fields.');
      return;
    }

    if (password !== cpassword) {
      alert('Passwords do not match.');
      return;
    }

    this.setState({ formSubmitted: true }, this.handleSendOtp);
  }

  finalSubmit() {
    const { fname, email, number, businessName, password, cpassword } = this.state;
  
    if (!fname || !email || !number || !businessName || !password || !cpassword) {
      alert('Please fill in all required fields.');
      return;
    }
  
    fetch("http://localhost:5000/VendorRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fname, email, number, businessName, password, cpassword })
    })
    .then((res) => {
      console.log("Response status:", res.status); // Log response status
      return res.json();
    })
    .then((data) => {
      console.log(data, "userRegister");
      if (data.status === 'ok') {
        alert('Registration successful!');
        // Store vendor ID in local storage or state
        localStorage.setItem('vendorId', data.vendorId);
        window.location.href="./Login";
      } else {
        alert('Registration failed: ' + data.message);
      }
    })
    
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  

  render() {
   
    const { formSubmitted, otpSent, emailOtpVerified } = this.state;

    return (
     <div >
         <Navbar />
    
      <div className='toppage'>
      
        <div className='container'>
          {!formSubmitted ? (
            <form onSubmit={this.handleSubmit}>
              <h3>Signup</h3>
              <div className='formbox'>
              <div className="form-container">
                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>First name</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => this.setState({ fname: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Email address</label>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Phone Number</label>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter phone number"
                    onChange={(e) => this.setState({ number: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Company/Business/Shop Name</label>
                  </div>
                  <input
  type="text"
  className="form-control"
  placeholder="Enter Company/Business/Shop Name"
  onChange={(e) => this.setState({ businessName: e.target.value })}
/>

                </div>
                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Password</label>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => this.setState({ password: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Confirm Password</label>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    onChange={(e) => this.setState({ cpassword: e.target.value })}
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              </div>
              </div>
            </form>
          ) : (
            <div>
              <h3>Verify Email OTP</h3>
              <div className="form-container">
                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Email OTP</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    onChange={(e) => this.setState({ emailOtp: e.target.value })}
                  />
                  <button type="button" onClick={this.handleVerifyOtp}>
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> </div>
    );
  }
}
