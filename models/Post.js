const {model, Schema } = require('mongoose');
//it can autopopulate if something doesnt exist
const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    profilePic:String,
    comments: [
        {
            body:String,
            username:String,
            createdAt:String,
            profilePic:String,
        }
    ],
    likes: [
        {
            username:String,
            createdAt:String
        }
    ],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});
module.exports = model( 'Post', postSchema);