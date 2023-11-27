const whitelist = require('./allowedOrigin')
const corsOption ={
    origin : (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 /* || !origin */){
            callback(null, true)
        }else{
            callback(new Error("not allowed your cors request"))
        }       
    },
    credentials:true,
    optionsSuccessStatus : 200
}

module.exports = corsOption
