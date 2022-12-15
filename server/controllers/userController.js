const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let data = await userModel.findOne({ email: email });
  if (!data) {
    console.log("Please register first");
    return res.json({ message: "Please Register first" });
  } else {
    const matchPassword = await bcrypt.compareSync(password, data.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email: data.email, id: data._id }, SECRET_KEY, {
      expiresIn: "30s",
    });
    res.status(201).json({ id: data._id, userEmail: data.email, token: token });
  }
});

router.post("/register", async (req, res) => {
  let already = await userModel.find({ email: req.body.email });
  if (already.length == 0) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let result = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(req.body.email, "is registered!");

    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET_KEY,
      { expiresIn: "500s" }
    );

    res
      .status(201)
      .json({ id: result._id, userEmail: result.email, token: token });
  } else {
    res.json({ message: "You are already registered!" });
  }
});

router.post("/exists", async (req, res) => {
  let result = await userModel.find({ email: req.body.email });
  if (result.length == 0) {
    res.send({ exists: false });
  } else {
    res.send({ exists: true });
  }
});

module.exports = router;
