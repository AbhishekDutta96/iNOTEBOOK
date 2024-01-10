import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, password}),
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
        // Save the authtoken and redirect
        localStorage.setItem("token", json.authtoken);
        navigate("/");
        props.showAlert("Account created successfully", "success");
    }else{
        props.showAlert("Invalid Credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-3">
        <h2>Create an account to use iNotebook</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="text">Your Name</label>
            <input
              type="text"
              className="form-control"
              onChange={onChange}
              id="name"
              name="name"
              aria-describedby="emailHelp"
            />
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              onChange={onChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={onChange}
              id="password"
              name="password"
              minLength={5} required
            />
            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              onChange={onChange}
              id="cpassword"
              name="cpassword"
              minLength={5} required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
  );
};

export default Signup;
