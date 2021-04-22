const {model, Schema } = require('mongoose');
//it can autopopulate if something doesnt exist
const organizationSchema = new Schema({

    orgName: String,
    orgDescription: String,
    orgLocationLat: Number,
    orgLocationLong: Number,
    orgType: String,

    orgActions:{
        type: Schema.Types.ObjectId,
        ref:'actions'
    },
    orgPosts:{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    orgOwner:{
        type: Schema.Types.Mixed,
        ref:'users'
    }
});

module.exports = model( 'Organization', organizationSchema);