const {model, Schema } = require('mongoose');

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  path: String,
  url:String
});

module.exports= model("File", fileSchema);