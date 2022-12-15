const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const fs = require("fs");

const filesModel = require('../models/filesModel')

router.post("/upload", async (req, res) => {
  const filename = Date.now() + "_" + req.files.file.name;
  const file = req.files.file;
  const email = req.body.email;
  let result = await filesModel.create({ email: email, filename: filename });

  if (!fs.existsSync("./uploads")) {
    fs.mkdir("./uploads", (err) => {
      if (err) throw err;
    });
  }

  console.log(result.data);
  let uploadPath = path.join(path.parse(__dirname).dir, "uploads", filename);
  file.mv(uploadPath, (err) => {
    console.log(err);
  });
  res.sendStatus(200);
});

router.post("/files", async (req, res) => {
  uploadsFolder = path.join(path.parse(__dirname).dir, "uploads");
  fileNames = [];
  let userEmail = req.body.email;
  let result = await filesModel.find({ email: userEmail }).then((files) => {
    files.forEach((file) => fileNames.push(file.filename));
  });
  res.send(fileNames);
});

router.post("/delete/:fname", async (req, res) => {
  fs.unlink(path.join(path.parse(__dirname).dir, "uploads", req.params.fname), (err) => {
    if (err) console.log("Error Description: " + err);
    console.log("File Deleted!");
  });
  let userEmail = req.body.email;
  let result = await filesModel.findOneAndDelete({
    email: userEmail,
    filename: req.params.fname,
  });
});

module.exports = router;
