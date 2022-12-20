const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const cookieParser = require("cookie-parser");
const { checkUser } = require("../middlewares/authMiddleware");

require("dotenv").config();
router.use(cookieParser());

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  let data = await userModel.findOne({ email: email });
  if (!data) {
    console.log("Please register first");
    return res.json({ message: "Please Register first" });
  } else {
    const matchPassword = await bcrypt.compareSync(password, data.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const access_token = jwt.sign(
      { email: data.email, id: data._id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "5m" }
    );
    console.log("access: ", access_token);
    res.cookie("jwt", access_token, {
      httpOnly: false, //accessible only by web server
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ id: data._id, email: data.email, token: access_token });
  }
});

router.post("/register", async (req, res) => {
  let already = await userModel.find({ email: req.body.email });
  if (already.length == 0) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let data = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(req.body.email, "is registered!");

    const access_token = jwt.sign(
      { email: data.email, id: data._id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "5m" }
    );
    
    res.cookie("jwt", access_token, {
      httpOnly: false, //accessible only by web server
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ id: data._id, email: data.email, token: access_token });
  } else {
    res.json({ message: "You are already registered!" });
  }
});

router.post("/exists", async (req, res) => {
  let data = await userModel.find({ email: req.body.email });
  if (data.length == 0) {
    res.send({ exists: false });
  } else {
    res.send({ exists: true });
  }
});
router.post("/", checkUser);

router.post("/logout", async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  res.json({ message: "Cookie cleared" });
});

module.exports = router;
