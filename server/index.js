const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
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