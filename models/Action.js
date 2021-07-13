const {model, Schema } = require('mongoose');

const actionSchema = new Schema({
    
    actName:String,
    actDescription:String,
    actLocationLat:Number,
    actLocationLong:Number,
    actType:String,
    actprofilePic:String,
    attendedUsername: [
        {
            username:String,
        }
    ],
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

    actOrg:{
        type:Schema.Types.Mixed,
        ref:'organizations'
    },
    actOwner:{
        type:Schema.Types.Mixed,
        ref:'users'
    }
});

module.exports = model( 'Action', actionSchema);