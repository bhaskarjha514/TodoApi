const nodemailer = require('nodemailer')
const config = require('config')
let adminEmail = config.get('adminEmail')
let adminPassword = config.get('adminPassword')

const mailer = (email, code) => {

    // The output message to be shown
    const output = `
        <p>Todo App , Next step is to verify your account</p>
        <p>code: ${code}</p>
    `;

    var transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user: adminEmail, // Your Email
            pass: adminPassword // your password
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    let mailOptions = {
        from: ' "Todo App ',
        to: email,
        subject: 'Account Activation',
        text: 'Account Activation',
        html: output
    }

    try {
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) console.log(err)
    
            console.log('Message sent: %s', info.messageId);
        })      
    } catch (error) {
       return 'Cannot send email' 
    }
}

module.exports = { mailer }