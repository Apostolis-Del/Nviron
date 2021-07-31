const {model, Schema } = require('mongoose');
//it can autopopulate if something doesnt exist
const donationSchema = new Schema({
    username: String,
    donateDate: String
});
module.exports = model( 'Donation', donationSchema);