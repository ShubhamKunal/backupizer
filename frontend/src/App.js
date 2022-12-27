import React from "react";
import "./App.css";
import Login from "./MyComponents/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./MyComponents/Register";
import UploadFiles from "./MyComponents/UploadFile";

function App() {
  return (
    <div className="App">
      <link rel="shortcut icon" href="public/favicon.ico"></link>
      <BrowserRouter>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<UploadFiles />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
