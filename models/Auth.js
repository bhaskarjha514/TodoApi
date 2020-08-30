const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    code: {
        type: Number
    }
})

var auth = mongoose.model('Auth', authSchema)
module.exports = auth