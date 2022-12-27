import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyFiles(props) {
  let files = props.files;
  const DeleteFile = async function (filename) {
    toast.warning("😨Deleting", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    await axios.post("/delete/" + filename, {
      fname: filename,
      email: props.email,
    });
  };
  return files === null ? (
    <h2>Please add your first file!</h2>
  ) : (
    <div className="container my-5">
      {files.length === 0 ? (
        <h3>Add your first file!!</h3>
      ) : (
        <div>
          <div>
            <h2>My Files</h2>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Files</th>
                  <th scope="col" colSpan={2}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  return (
                    <tr key={file}>
                      <td>{file}</td>
                      <td>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() =>
                            (document.location.href =
                              "http://localhost:4000/uploads/" + file)
                          }
                        >
                          Download
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => {DeleteFile(file);}}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
    </div>
  );
}
