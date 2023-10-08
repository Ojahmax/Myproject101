const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/phoneCovers'

const phoneSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    releaseDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    addedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    Brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brand'
    }

})

phoneSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return PaymentMethodChangeEvent,join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Phone', phoneSchema),
module.exports.coverImageBasePath = coverImageBasePath