const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require('dotenv').config()
const userController = require('./controllers/userController')
const fileController = require('./controllers/fileController');
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({origin:["http://localhost:3000"],credentials:true}));
app.use(cookieParser())
app.use(fileUpload());
app.use(express.static("uploads"));
app.use("/",userController)
app.use("/",fileController)

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});