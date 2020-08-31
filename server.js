const express = require('express')
const connectDB = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ extended : true }))

// connect to database
connectDB()

// routes
app.get('/',(req, res, next=>{
    res.status(200).json({
        msg:"home"
    })
}))
app.use('/api/todo/auth',require('./routes/user'))

app.listen(PORT , () => console.log(`Server running at ${PORT}`))