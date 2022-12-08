const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require('passport')
// const cookieSession = require('cookie-session')
// const cookieParser = require('cookie-parser')


const SECRET_KEY = "WHOCANEVERGUESSIT?";

const app = express();
app.use(express.json());
app.use(cors());

// app.use(cookieParser())
app.use(fileUpload());
app.use(express.static("uploads"));
mongoose.set("strictQuery", true);



mongoose.connect("mongodb://localhost:27017/krayo-disk-db");
const userSchema = mongoose.Schema({
  email: {
    type:String
  },
  password: String,
});
const userModel = mongoose.model("krayo-disk-users", userSchema);

const filesSchema = mongoose.Schema({
  email: String,
  filename: String,
});
const filesModel = mongoose.model("krayo-disk-files", filesSchema);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let data = await userModel.findOne({ email: email });
  if (!data) {
    console.log("Please register first");
    return res.json({ message: "Please Register first" });
  } else {
    console.log(data);
    const matchPassword = await bcrypt.compare(password, data.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email: data.email, id: data._id }, SECRET_KEY, {
      expiresIn: "500s",
    });
    res.status(201).json({ user: data, token: token });
  }
});

app.post("/register", async (req, res) => {
  let already = await userModel.find({ email: req.body.email });
  if (already.length == 0) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let result = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(req.body);
    console.log("Registered!");

    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET_KEY,
      { expiresIn: "500s" }
    );

    res.status(201).json({ user: result, token: token }).redirect('/login');
  } else {
    res.json({ message: "You are already registered!" });
  }
});

app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      console.log("Invalid Token");
      res.send({ result: "Invalid token" });
    } else {
      console.log("Profile accessed");
      res.json({ message: "Profile accessed", authData });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      result: "Token is not valid",
    });
  }
}

app.post("/upload", (req, res) => {
  const filename = Date.now() + "_" + req.files.file.name;
  const file = req.files.file;
  let uploadPath = path.join(__dirname, "uploads", filename);
  console.log(uploadPath);
  file.mv(uploadPath, (err) => {
    console.log(err);
  });
  res.sendStatus(200);
});

app.get("/files", (req, res) => {
  uploadsFolder = path.join(__dirname, "uploads");
  fileNames = [];
  fs.readdir(uploadsFolder, (err, files) => {
    files.forEach((file) => {
      fileNames.push(file);
    });
    return res.send(fileNames);
  });
});

app.post("/delete/:fname", (req, res) => {
  fs.unlink(path.join(__dirname, "uploads", req.params.fname), (err) => {
    if (err) console.log("Error Description: " + err);
    console.log("File Deleted!");
  });
});

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
