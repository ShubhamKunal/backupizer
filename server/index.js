const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const userController = require('./controllers/userController')
const fileController = require('./controllers/fileController')

const app = express();
app.use(express.json());
app.use(cors());

app.use(fileUpload());
app.use(express.static("uploads"));
app.use("/",userController)
app.use("/",fileController)

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});



// app.post("/profile", verifyToken, (req, res) => {
//   jwt.verify(req.token, SECRET_KEY, (err, authData) => {
//     if (err) {
//       console.log("Invalid Token");
//       res.send({ result: "Invalid token" });
//     } else {
//       console.log("Profile accessed");
//       res.json({ message: "Profile accessed", authData });
//     }
//   });
// });

// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (typeof bearerHeader !== undefined) {
//     const bearer = bearerHeader.split(" ");
//     const token = bearer[1];
//     req.token = token;
//     next();
//   } else {
//     res.send({
//       result: "Token is not valid",
//     });
//   }
// }


