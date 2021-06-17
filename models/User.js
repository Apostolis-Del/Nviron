const {model, Schema } = require('mongoose');

//it can autopopulate if something doesnt exist
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    profilePic:String,
    
    //dika mou
    subscribed:[{
        type:Schema.Types.Mixed,
        ref:"organizations"
    }],
    isOwnerOrg:[{
        type:Schema.Types.Mixed,
        ref:"organizations"
    }],
    isOwnerAct:{
        type:Schema.Types.Mixed,
        ref:"actions"
    }
});

module.exports = model('User',userSchema);