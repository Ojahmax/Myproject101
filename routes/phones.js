const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Phone = require('../models/phone')
const uploadPath = path.join('public', Phone.coverImageBasePath)
const Brand = require('../models/brand')
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, res, callback) =>{
        callback(null)
    }
})

router.get('/', async (req, res) => {
    try {
        const phones =  await Phone.find({})
        res.render('phones/index', {
            phones: Phones,
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
            renderNewPage(res, phone, true)
        }
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