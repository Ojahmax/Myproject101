const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Phone = require('../models/phone')
const Brand = require('../models/brand')
const uploadPath = path.join('public', Phone.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    let query = Phone.find()
    if (req.query.model != null && req.query.model != '') {
    query = query.regex('model', new RegExp(req.query.model, 'i'))
    }
    if (req.query.releaseDate != null && req.query.releaseDate != '') {
        query = query.lte('releaseDate', req.query.releaseDate)
    }
    try {
        const phones =  await query.exec()
        res.render('phones/index', {
            phones: phones,
            searchOptions: req.query
        })  

    } catch {
        res.redirect('/')
    }
      
})


router.get('/new', async (req, res) => {
    renderNewPage(res, new Phone())
})


router.post('/', upload.single('cover'), async(req, res) => {
    const fileName = req.file != null ? req.file.fieldname : null
    const phone = new Phone({
        model: req.body.model,
        description: req.body.description,
        releaseDate: new Date(req.body.releaseDate),
        quantity: req.body.quantity,
        coverImageName: fileName,
        brand: req.body.brand
    })

    try {
        const newPhone = await phone.save()
        //res.redirect('phones/${newPhone.id}')
        res.redirect('phones')
    }
    catch {
        if (phone.coverImageName != null){
            removePhoneCover(phone.coverImageName)
            
        }
        renderNewPage(res, phone, true)
    }

})

function removePhoneCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) console.error(err)
    })
}

async function renderNewPage(res, phone, hasError = false){
    
    try{
        const brands = await Brand.find({})
        const params = {
            brands: brands,
            phone: phone
        }
        if(hasError) params.errorMessage = 'Error Creating'
        res.render('phones/new', params)
    }        
    catch{
        res.redirect('/phones')
    }
}

module.exports = router