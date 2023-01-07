const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://shubhamkunal:zac@cluster0.p2hyowd.mongodb.net/backupizer-disk-db");
const userSchema = mongoose.Schema({
  email: {
    type: String,
  },
  password: String,
});
const userModel = mongoose.model("krayo-disk-users", userSchema);

module.exports = userModel;
