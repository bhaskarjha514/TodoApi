const mongoose = require('mongoose')
const config = require('config')

let db = config.get('mongoURIProd')

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('DB connected ....')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB