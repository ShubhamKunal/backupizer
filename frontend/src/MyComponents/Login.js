import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userID, setUserID] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  if (redirect === true) {
    navigate("/", { state: { id: userID, email: userEmail, token: token } });
  }

  function handleCallbackResponse(response) {
    const token = response.credential;
    var userObject = jwtDecode(token);
    loginWithGoogle(userObject.email, userObject.email);
  }
  const loginWithGoogle = async function (email, pass) {
    axios.post("/exists", { email: email }).then(function (response) {
      if (response.data.exists) {
        axios
          .post("/login", {
            email: email,
            password: pass,
          })
          .then(function (response) {
            setUserID(response.data.id);
            setUserEmail(response.data.userEmail);
            setToken(response.data.token);

            localStorage.setItem(
              "userLocalData",
              JSON.stringify({
                id: userID,
                email: userEmail,
                token: token,
              })
            );
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            toast.success("😘 Logged In!", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setTimeout(() => {
              setRedirect(true);
            }, 2000);
          });
      } else {
        axios
          .post("/register", {
            email: email,
            password: pass,
          })
          .then(function (response) {
            setUserID(response.data.id);
            setUserEmail(response.data.userEmail);
            setToken(response.data.token);
            toast("😁 Registered! Now logging you in", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setTimeout(() => {
              setRedirect(true);
            }, 2000);
          });
      }
    });
  };
  const loginNow = async function (e, email, pass) {
    e.preventDefault();
    axios
      .post("/login", {
        email: email,
        password: pass,
      })
      .then(function (response) {
        setUserID(response.data.id);
        setUserEmail(response.data.userEmail);
        setToken(response.data.token);

        localStorage.setItem(
          "userLocalData",
          JSON.stringify({
            id: userID,
            email: userEmail,
            token: token,
          })
        );
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        toast.success("😘 Logged In!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          setRedirect(true);
        }, 2000);
      });
  };
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "582447123542-uqlrs6m29uc7sa0ksrmiovb0d2d2cutu.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "medium",
    });
  });

  return (
    <div className="container">
      <div className="image"><img src="Krayo_logo.png" alt="Nothing to see here folks!"/></div>
      <form id="login" onSubmit={(e) => loginNow(e, email, pass)}>
        <h2>Krayo Disk</h2>
        <div className="mb-2">
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
        <div className="mb-2">
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
