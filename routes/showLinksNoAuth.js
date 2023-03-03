const express = require('express')
const router = express.Router()
const { getAllLinks } = require('../controllers/showLinksNoAuth')

router.get('/:username', getAllLinks)

module.exports = router


