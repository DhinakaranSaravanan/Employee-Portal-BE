const {format} = require('date-fns')
const {v4:uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

async function logEventHandler(msg, fileName){
    const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs')))
            {
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        } 
        await fsPromises.appendFile(path.join(__dirname,'..','logs',fileName),logItem)
        
    } catch(err){
        console.log(err);
    }
}

const logger = (req, res, next) => {     
    logEventHandler(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLogs.txt')
    console.log(`${req.method}\t${req.url}\t${req.headers.origin}`);
    next()
}

module.exports = {logEventHandler, logger}