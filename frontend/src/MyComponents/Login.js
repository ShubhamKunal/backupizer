import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";

export default function Login() {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  const baseURL = "https://fileuploader-server.onrender.com/";

  const setHeader = function (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  const [values, setValues] = useState({ email: "", password: "" });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        baseURL+"login",
        {
          ...values,
        },
        { withCredentials: true }
      );

      localStorage.setItem("app_token", "Bearer " + data.token);
      setHeader(data.token);
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          toast.info("😘 Logging in!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(()=>{
            navigate("/");
          },2000)
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  async function handleCallbackResponse(response) {
    const token = response.credential;
    var userObject = jwtDecode(token);
    values.email = userObject.email;
    values.password = userObject.email;

    const resp = await axios.post("/exists", { ...values });
    if (resp.data.exists) {
      //login
      const { data } = await axios.post(
        baseURL+"login",
        {
          ...values,
        },
        { withCredentials: true }
      );
      localStorage.setItem("app_token", "Bearer " + data.token);
      setHeader(data.token);
      toast.info("😘 Logging in!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(()=>{
        navigate("/");
      },2000)
    } else {
      //register
      const { data } = await axios.post(
        baseURL+"register",
        {
          ...values,
        },
        { withCredentials: true }
      );
      localStorage.setItem("app_token", "Bearer " + data.token);
      setHeader(data.token);
      toast.info("😘 Logging in!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(()=>{
        navigate("/");
      },2000)
    }
  }
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "582447123542-uqlrs6m29uc7sa0ksrmiovb0d2d2cutu.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  });
  

  return (
    <div className="container">
      <div className="image">
        <img src="backupizer_logo.png" alt="Nothing to see here folks!" />
      </div>
      <form id="login" onSubmit={(e) => handleSubmit(e)}>
        <h2>Backupizer</h2>
        <div className="mb-2">
          <h6>Login Form</h6>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm my-2">
          Login
        </button>{" "}
        <br />
        <center>
          <div id="signInDiv"></div>
        </center>
        <span>
          First time here? <Link to="/register">Regsiter</Link>
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
