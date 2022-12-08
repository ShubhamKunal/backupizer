import React from "react";
import axios from "axios";

export default function MyFiles(props) {
  let files = props.files;
  const DeleteFile = async function(filename){
    await axios.post("/delete/"+filename,{
      fname:filename
    })
  }
  return (
    files===null?<h2>Please add your first file!</h2>:
    <div className="container my-4" >
      <div>
      {}
      <h2>My Files</h2>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Files</th>
            <th scope="col" colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          
          {files.map((file) => {
             return <tr key={file}>
              <td>{file}</td>
              <td>
                <button 
                className="btn btn-dark btn-sm"
                onClick={()=>document.location.href="http://localhost:4000/"+file}>Download</button>
              </td>
              <td>
                <button 
                className="btn btn-dark btn-sm"
                onClick={()=>DeleteFile(file)}>Delete</button>
              </td>
            </tr>
          })}
          
        </tbody>
      </table>
      </div>
    </div>
  );
  
}
