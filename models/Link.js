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
        show: {
            type: Boolean,
            required: [true, 'Please decide whether you want to show it or not [boolean]']
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
    urlRegex = /[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.[^\s]*$/;
    return urlRegex.test(val);
}, 'Invalid URL.');
module.exports = mongoose.model('Link', LinkSchema)