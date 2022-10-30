const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    metaMaskAccount: {
        type: String,
        required: false
    },
    offers: {
        type: Array,
        required: false
    },
    requests: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('user', UserSchema);