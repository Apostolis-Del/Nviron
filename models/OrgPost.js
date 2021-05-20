const {model, Schema } = require('mongoose');
//it can autopopulate if something doesnt exist
const orgpostSchema = new Schema({
    body: String,
    username: String,
    orgname:String,
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
    org:{
        type:Schema.Types.ObjectId,
        ref:'organizations'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});
module.exports = model( 'OrgPost', orgpostSchema);