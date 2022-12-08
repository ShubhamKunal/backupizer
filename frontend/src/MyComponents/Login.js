import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  //   const [token, setToken] = useState(null);
  const loginNow = function(email, pass) {
    axios
      .post("/login", {
        email: email,
        password: pass,
      })
      .then(function(response) {
        console.log(response.data);
      });
  };

  return (
    <div className="container">
      <form id="login" onSubmit={() => loginNow(email, pass)}>
        <h2>Krayo Disk</h2>
        <div className="mb-3">
        <h6>Login Form</h6>
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
          Login 
        </button><br/>
        <span>
        First time here? <Link to="/register">Regsiter</Link>
      </span>
      </form>
    </div>
  );
}
