import React, { useEffect } from "react";
import FormData from "form-data";
import axios from "axios";
import { useState } from "react";
import MyFiles from "./MyFiles";
import "./UploadFile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function UploadFile(props) {
  const [file, setFile] = useState(null);
  const baseURL = "http://localhost:4000/";
  const [myFiles, setMyFiles] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    getFiles()
  })

  const handleUpload = async function (e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("file", file);
    formData.append("email", location.state.email);

    toast.info("🚀 Uploading...", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    try {
      await axios.post(baseURL + "upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log("There was an error");
    }
  };

  let handleLogout = function (e) {
    e.preventDefault();
    toast.success("👋 Bye Bye.", {
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
      location.state = null;
      navigate("/login")
    }, 2000);
  };
  let getFiles = function () {
    try {
      axios
        .post(baseURL + "files", { email: location.state.email })
        .then(function (response) {
          setMyFiles(response.data);
        })
        .catch((err) => {
          console.log("This Error: " + err);
        });
    } catch (e) {
      console.log("There's this error: " + e);
    }
  };

  
  

  return (
    <div className="container my-2" id="uploader">
      <h2>Krayo-Disk</h2>
      <div className="fw-bold font-monospace">
        Hi, {location.state !== null ? location.state.email : "USER"}!
      </div>
      <div className="input-group mb-3 my-4">
        <label className="input-group-text" htmlFor="inputGroupFile01">
          Upload
        </label>
        <input
          type="file"
          className="form-control"
          id="inputGroupFile01"
          name="thing"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
      </div>
      <button
        className="btn btn-sm btn-dark center"
        onClick={(e) => handleUpload(e)}
      >
        Submit
      </button>{" "}
      <button className="btn btn-sm btn-dark" onClick={(e) => handleLogout(e)}>
        Logout
      </button>
      <ToastContainer
        position="top-center"
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
      <MyFiles
        files={myFiles}
        email={location.state !== null ? location.state.email : []}
      />
    </div>
  );
}
