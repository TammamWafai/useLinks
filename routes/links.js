const express = require('express')

const router = express.Router()
const {
    createLink,
    deleteLink,
    getAllLinks,
    updateLink,
    getLink,
} = require('../controllers/links')

router.route('/').post(createLink).get(getAllLinks)

router.route('/:id').get(getLink).delete(deleteLink).patch(updateLink)

module.exports = router