const mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    tokenId: {
        type: Number,
        required: true
    },
    offers: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('offer', OfferSchema);