const mongoose = require('mongoose');

//basically the db built, NOTE=> creation of Schema will auto create table in MongoDB
const Schema = mongoose.Schema;
const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);