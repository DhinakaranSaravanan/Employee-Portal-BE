const {logEventHandler} = require('./logEvents')
const errLogHandler = (err,req,res,next) => {
    logEventHandler(`${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLogs.txt')

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status)
    res.json({message : err.message, isError : true})
    
}

module.exports = errLogHandler