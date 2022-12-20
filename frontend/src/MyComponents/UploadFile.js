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

export default function UploadFile(props) {
  const [file, setFile] = useState(null);
  const [UserEmail, setUserEmail] = useState(null);
  const baseURL = "http://localhost:4000/";
  const [myFiles, setMyFiles] = useState(null);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['jwt']);

  let getFiles = async function () {
    setMyFiles(null);
    try {
      await axios
        .post(baseURL + "files", { email: UserEmail })
        .then(function (response) {
          setMyFiles(response.data);
        });
    } catch (e) {
      console.log("There's this error: " + e);
    }
  };
  

  const logOut = (e) => {
    e.preventDefault()
    localStorage.removeItem("app_token");
    removeCookie("jwt")
    Cookie.remove("jwt")
    navigate("/login");
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
    getFiles();
  };
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        setUserEmail(data.user);
        if (!data.status) {
          navigate("/login");
        } else {
          // toast(`Hi ${data.user} 🦄`, {
          //   theme: "dark",
          // });
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  

  return (
    <div className="container my-2" id="uploader">
      <h2>Krayo-Disk</h2>
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
      <MyFiles files={myFiles} email={UserEmail !== null ? UserEmail : []} />
    </div>
  );
}
