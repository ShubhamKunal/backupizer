import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link,Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Regsiter() {
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [redirect, setRedirect] = useState(false)
  //   const [token, setToken] = useState(null);

  if(redirect===true){
    return <Navigate to="/" />
  }
  const registerNow = function(e,email, pass) {
    e.preventDefault()
    axios
      .post("/register", {
        email: email,
        password: pass,
      })
      .then(function(response) {
        console.log(response.data);
        toast("Registered! Now logging you in")
        setTimeout(()=>{
          setRedirect(true)
        },2000)
      });

  };

  return (
    <div className="container">
      <form id="register" onSubmit={(e) => registerNow(e,email, pass)}>
        <h2>Krayo Disk</h2>
        <div className="mb-3">
          <h6>Registration Form</h6>
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="pass"
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm my-2">
          Register
        </button><br/>
        <span>
        Already Registered? <Link to="/login">Login</Link>
      </span>
      </form>
      <ToastContainer />
    </div>
  );
}
