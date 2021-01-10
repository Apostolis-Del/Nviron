const {model, Schema } = require('mongoose');

//it can autopopulate if something doesnt exist
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User',userSchema);