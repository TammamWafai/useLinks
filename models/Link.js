const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema(
    {
        platform: {
            type: String,
            required: [true, 'Please provide platform name'],
            maxlength: 50,
        },
        url: {
            type: String,
            required: [true, 'Please provide url'],
            maxlength: 100,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Link', LinkSchema)