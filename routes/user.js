const express = require('express')
const router = express.Router();
const mailer = require('../utils/SendMail')

const User = require('../models/User');
const Auth = require('../models/Auth')
const bcryptjs = require('bcryptjs');


router.post('/register',async (req, res, next)=>{
    const {username, email, password} = req.body
    let code = generateOTP()
    try{
        let user_exist = await User.findOne({'email':email});
       
        if(user_exist){
            let checkAuth = await Auth.findOne({'email':email});
            if(checkAuth){
                res.status(404).json({
                    msg:"Email Already used! Enter Otp"
                }) 
            }else{
                res.status(404).json({
                    msg:"Email Already used"
                })
            }
           
        }else{
            user = new User()
            user.username = username
            user.email = email
            const salt = await bcryptjs.genSalt(10)
            user.password = await bcryptjs.hash(password, salt)
        
            const authData = new Auth({
                email,
                code
            }) 
                
            msg = mailer.mailer(email, code)
            if(msg){
                return res.status(400).json({'message' : 'Cannot Send activation mail ! Check your email and try again'})
            }
            await user.save(async (err, response) => {
                if (err) res.status(500).json({ 'message': 'Server Fucked Up 😑😢' })
                await authData.save((err, response) => { 
                    if (err) res.status(500).json({ 'message': 'Server Fucked Up 😑😢' })
                        res.status(201).json({ 'message': 'SignUp successful', 'User': user })
                    })
               })
        }

    }catch(err){
        console.log(err)
    }    
})

router.get('/verify/', async (req, res) => {
    const code = req.query.code
    const email = req.query.email

    console.log(email)
    const acc = await Auth.findOne({'email':email})
   
    if(!(acc.code == code)){
        return res.json({msg:'otp is incorrect'})
    }else{
        await Auth.findOneAndDelete({'email':email})
        await User.findOneAndUpdate({'email':email}, {'isVerified':true})
        return res.json({'message' : 'Account has verified'})
    }
})



function generateOTP() { 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

module.exports = router