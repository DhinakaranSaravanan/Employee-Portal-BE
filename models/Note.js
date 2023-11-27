const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
    user:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    title:{
        type : String,
        required : true
    },
    text:{
        type : String,
        required : true
    },
    completed:{
        type : Boolean,
        default : false
        //so the task always open state 
    }
    },
    {
        timestamps : true
    }
)
noteSchema.plugin(AutoIncrement,{
    inc_field : 'ticket',//name to display name 
    id : 'ticketNums',//save as seperate ticket number
    start_seq : 500// ticket number start from 500++...
})

module.exports = mongoose.model("Note",noteSchema)