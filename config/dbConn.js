const mongoose =require('mongoose')

const connectDB = async function(){
    try {
        await mongoose.connect(process.env.DATABASE_URI) 
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB 