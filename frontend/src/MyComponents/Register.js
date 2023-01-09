import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Loading } from "./Loading";

export default function Register() {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);
  const [values, setValues] = useState({ email: "", password: "" });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const setHeader = function (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/register",
        {
          ...values,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setHeader(data.token);
      localStorage.setItem("app_token", "Bearer " + data.token);
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          toast.info("🤗 Registered. Come in!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(() => {
            setCookie("jwt",data.token);
            navigate("/");
          }, 2000);
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="container">
      {loading?<Loading/>:<div className="image">
        <img src="backupizer_logo.png" alt="Nothing to see here folks!" />
      </div>}
      <form id="register" onSubmit={(e) => handleSubmit(e)}>
        <h2>Backupizer</h2>
        <div className="mb-3">
          <h6>Registration Form</h6>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm my-2">
          Register
        </button>
        <br />
        <span>
          Already Registered? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
