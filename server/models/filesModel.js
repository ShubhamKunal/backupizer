const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://shubhamkunal:zac@cluster0.p2hyowd.mongodb.net/backupizer-disk-db");
const filesSchema = mongoose.Schema({
  email: String,
  filename: String,
});
const filesModel = mongoose.model("krayo-disk-files", filesSchema);

module.exports = filesModel;
