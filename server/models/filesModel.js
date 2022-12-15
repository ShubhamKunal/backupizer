const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/krayo-disk-db");
const filesSchema = mongoose.Schema({
  email: String,
  filename: String,
});
const filesModel = mongoose.model("krayo-disk-files", filesSchema);

module.exports = filesModel;
