require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500;
const {logger, logEventHandler} = require('./middleware/logEvents')
const errLogHandler = require('./middleware/errHandler')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const corsOption = require('./config/corsOption')
const cors = require('cors');

console.log(process.env.NODE_ENV)

mongoose.set('strictQuery',false)

connectDB()
app.use(logger)
app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())
app.use("/", express.static(path.join(__dirname,"public")))
app.use("/", require('./routers/root'))

app.use("/users", require('./routers/userRoutes'))
app.use("/notes", require('./routers/noteRoutes'))
app.use("/auth", require('./routers/authRoutes'))
app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,"views","404.html"))
    } else if(req.accepts("json")){
        res.json({"message" : "404 page not found"})
    }else{
        res.type("txt").send("404 page not found")
    }
})


 app.use(errLogHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`server is running on ${PORT}`))
})

mongoose.connection.on('error', (err) => {
    console.log(err);
    logEventHandler(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLogs.txt')

})



