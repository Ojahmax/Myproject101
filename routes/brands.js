const express = require('express')
const router = express.Router()
const Brand = require('../models/brand')

router.get('/', async (req, res) => {
    let searchOptions ={}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {          
        const brands = await Brand.find(searchOptions)
        res.render('brands/index', {
            brands: brands, 
            searchOptions: req.query 
        })
    }
    catch{
        res.redirect('/')
    }
    
})

router.get('/new', (req, res) => {
    res.render('brands/new', {brand: new Brand()})
})

router.post('/', async(req, res) => {
    const brand = new Brand({
        name: req.body.name
    })
    try {
        const newBrand = await brand.save()
       // res.redirect('brands/${newBrand.id')
        res.redirect('brands')

    } catch {
        res.render('brands/new', {
          brand: brand, 
          errorMessage: "Error Creating Brand"
        })
    }
   
   
})

module.exports = router