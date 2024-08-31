import React, { Component } from 'react';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;

    // Basic validation
    if (!email || !password) {
      this.setState({ error: 'Please enter both email and password.' });
      return;
    }

    fetch("http://localhost:5000/Vendorlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "ok") {
          const { vendortoken, vendorId } = data.data;
          alert("Login successful");
          window.localStorage.setItem("vendortoken", vendortoken);
          window.localStorage.setItem("vendorId", vendorId);
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "./VendorSelectPlan";
        } else {
          this.setState({ error: 'Login failed. Please check your credentials.' });
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        this.setState({ error: 'An error occurred. Please try again later.' });
      });
  }

  render() {
    return (
      <div className='toppage2'>
        <div className="login-container">
          <div className="card login-card">
            <div className="card-body">
              <h3 className="login-title text-center">Vendor Login</h3>
              {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" name="login">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
