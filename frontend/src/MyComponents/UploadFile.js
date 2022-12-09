import React from "react";
import FormData from "form-data";
import axios from "axios";
import { useState } from "react";
import MyFiles from './MyFiles'

export default function UploadFile(props) {
  const [file, setFile] = useState(null);
  const baseURL = "http://localhost:4000/";
  const [myFiles, setMyFiles] = useState(null);

  const handleUpload = async function(e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("file", file);
    console.log(file);
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

    axios.get(baseURL + "files")
      .then(function(response) {
        setMyFiles(response.data)
      })
      .catch((err) => {
        console.log("This Error: " + err);
      });
 
  return (
    <div className="container my-4">
      <h2>Krayo-Disk</h2>
      <br />
      {props.state}
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
      
      <button className="btn btn-sm btn-dark" onClick={(e) => handleUpload(e)}>
        Submit
      </button>
     
      <MyFiles files={myFiles} />
    </div>
  );
}
