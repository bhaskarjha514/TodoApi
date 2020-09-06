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
                res.status(404).send()
            }else{
                res.status(404).send()
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
                return res.status(400).send()
            }
            await user.save(async (err, response) => {
                if (err) return res.status(400).send()
                await authData.save((err, response) => { 
                    if (err) return res.status(400).send()
                        return res.status(201).json({'message':'otp has been send to email'})
                    })
               })
        }

    }catch(err){
        console.log(err)
        res.status(500).send()
    }    
})

router.get('/verify/', async (req, res) => {
    const code = req.query.code
    const email = req.query.email

    console.log(email)
    const acc = await Auth.findOne({'email':email})
   
    if(!(acc.code == code)){
        return res.status(400).send()
    }else{
        await Auth.findOneAndDelete({'email':email})
        await User.findOneAndUpdate({'email':email}, {'isVerified':true})
        return res.status(201).send()
    }
})

router.post('/login', async (req, res, next)=>{
    const email = req.body.email
    const password = req.body.password

    try{
        let user = await User.findOne({'email':email})
        if(!user){
            res.status(400).send()
        }else{
            const isVerified = await user.isVerified
            if(!isVerified){
                res.status(400).send()
            }else{
                const isMatch = await bcryptjs.compare(password,user.password)
                if(!isMatch){
                    return res.status(400).send()
                }else{
                    return res.status(201).send()
                }
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).send()
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
