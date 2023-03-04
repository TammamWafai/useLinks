const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema(
    {
        platform: {
            type: String,
            enum: ['facebook', 'instagram', 'twitter'],
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

LinkSchema.path('url').validate((val) => {
    urlRegex = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');
module.exports = mongoose.model('Link', LinkSchema)