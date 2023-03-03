const Link = require('../models/Link')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllLinks = async (req, res) => {

    const userName = req.params.username
    console.log(userName)
    const user = await User.findOne({ username: userName })
    if (user == null) {
        throw new NotFoundError('Username not found')
    }
    console.log(user)
    const links = await Link.find({ createdBy: user._id }).sort('createdAt')
    console.log(links, user._id)
    res.status(StatusCodes.OK).json({ links, count: links.length, name: user.name })
}
// const getLink = async (req, res) => {
//     const {
//         user: { userId },
//         params: { id: linkId },
//     } = req

//     const link = await Link.findOne({
//         _id: linkId,
//         createdBy: userId,
//     })
//     if (!link) {
//         throw new NotFoundError(`No link with id ${linkId}`)
//     }
//     res.status(StatusCodes.OK).json({ link })
// }



module.exports = {
    getAllLinks,
}