const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const fs = require("fs");
const download = require("download");
const downloadsFolder = require("downloads-folder");
const filesModel = require("../models/filesModel");
const verifyJWT = require("../middlewares/verifyJWT");
const https = require("https");
const cookieParser = require("cookie-parser");

router.use(verifyJWT);
router.use(express.json());


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
  let { email } = req.body;
  let result = await filesModel.find({ email: email }).then((files) => {
    files.forEach((file) => fileNames.push(file.filename));
  });
  res.send(fileNames);
});

router.post("/delete/:fname", async (req, res) => {
  fs.unlink(
    path.join(path.parse(__dirname).dir, "uploads", req.params.fname),
    (err) => {
      if (err) console.log("Error Description: " + err);
      console.log("File Deleted!");
    }
  );
  let userEmail = req.body.email;
  let result = await filesModel.findOneAndDelete({
    email: userEmail,
    filename: req.params.fname,
  });
});

router.get("/download/:fname", async (req, res) => {
  //download file of fname from uploads folder
  // const file = path.join(
  //   path.parse(__dirname).dir,
  //   "uploads",
  //   req.params.fname
  // );
  
  // https.get(file, (res) => {
  //   const Path = downloadsFolder();
  //   const filePath = fs.createWriteStream(Path);
  //   res.pipe(filePath)
  //   filePath.on('finish',()=>{
  //     filePath.close();
  //       console.log('Download Completed');
  //   })

    
  // });

  console.log(req.params.fname," is downloaded!")
});

module.exports = router;
