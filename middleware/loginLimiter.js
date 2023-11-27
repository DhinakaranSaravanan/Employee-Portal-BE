const rateLimit = require('express-rate-limit')
const {logEventHandler } = require('./logEvents')

const loginLimiter = rateLimit({
    windowMs :60 * 1000, //delay time for wrong entry
    max:5, //each login ip has 5 login request per window
    message : {message : "To many login attemp try after 60 sec"},
    handler:(req, res, next, options) => {
        logEventHandler(`Too many request from :${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders:true,
    lagacyHeaders:false,
})

module.exports = loginLimiter
