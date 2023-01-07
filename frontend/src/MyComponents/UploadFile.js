import React, { useEffect } from "react";
import FormData from "form-data";
import axios from "axios";
import { useState } from "react";
import MyFiles from "./MyFiles";
import "./UploadFile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookie from 'js-cookie'
import jwtDecode from "jwt-decode";

export default function UploadFile(props) {
  const [file, setFile] = useState(null);
  const [UserEmail, setUserEmail] = useState(null);
  const baseURL = "https://fileuploader-server.onrender.com/";
  const [myFiles, setMyFiles] = useState(null);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['jwt']);
 
  useEffect(()=>{
    if (!cookies.jwt) {
      navigate("/login");
    } else {
    setMyFiles(null);
    var userObject = jwtDecode(document.cookie.split(`jwt=`)[1])
    setUserEmail(userObject.email)
    getFiles()
    }
},[])

  const logOut = (e) => {
    e.preventDefault()
    toast.info("👋 Bye Bye!", {
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
      setMyFiles(null)
      localStorage.removeItem("app_token");
      removeCookie("jwt")
      Cookie.remove("jwt")
      navigate("/login");
    },2000)
  };

  const handleUpload = async function (e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("file", file);
    formData.append("email", UserEmail);

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
    setMyFiles(false)
    getFiles();
  };
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          baseURL,
          {},
          {
            withCredentials: true,
          }
        );
        setUserEmail(data.user);
        if (!data.status) {
          navigate("/login");
        } else {
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  

  let getFiles = async function () {
    setMyFiles(null);
    const email1 = (jwtDecode(document.cookie.split(`jwt=`)[1]).email)
    setUserEmail(email1)
    try {
      await axios
        .post(baseURL+"files", { email: email1 })
        .then(function (response) {
          setMyFiles(response.data);
        });
    } catch (e) {
      console.log("There's this error: " + e);
    }
  };

  return (
    <div className="container my-2" id="uploader">
      <h2>Backupizer</h2>
      <div className="fw-bold font-monospace">
        Hi, {UserEmail !== null ? UserEmail : "User"}!
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
        className="btn btn-sm btn-dark center mx-2"
        onClick={() => getFiles()}
      >
        Update Files
      </button>
      <button
        className="btn btn-sm btn-dark center"
        onClick={(e) => handleUpload(e)}
      >
        Submit
      </button>{" "}
      <button className="btn btn-sm btn-dark" onClick={(e) => logOut(e)}>
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
      <MyFiles files={myFiles} email={UserEmail !== null ? UserEmail : []} getFiles={()=>getFiles()} />
    </div>
  );
}
