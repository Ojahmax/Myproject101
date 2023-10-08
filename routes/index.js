const express = require('express')
const router = express.Router()
const Book = require('../models/phone')

router.get('/', async (req, res) => {
    let phones
    try{
        phones = await phones.find().sort({ addedDate: 'desc'}).limit(10).exec()
    } catch {
        phones = []
    }
    res.render('index', { phones: phones})
})


module.exports = router