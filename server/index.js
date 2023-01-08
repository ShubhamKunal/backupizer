const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require('dotenv').config()
const userController = require('./controllers/userController')
const fileController = require('./controllers/fileController');
const cookieParser = require("cookie-parser");
const { giveStatic } = require("./middlewares/authMiddleware");
const favicon = require('serve-favicon')
const path = require('path')

const app = express();
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))
app.use(express.json());
app.use(cors({origin:["https://fileupload-kunal.netlify.app"],credentials:true}));
app.use(cookieParser())
app.use(fileUpload());
app.use('/uploads', [giveStatic,express.static("uploads")])

app.use("/",userController)
app.use("/",fileController)

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
