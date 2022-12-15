const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/krayo-disk-db");
const userSchema = mongoose.Schema({
  email: {
    type: String,
  },
  password: String,
});
const userModel = mongoose.model("krayo-disk-users", userSchema);

module.exports = userModel;
