const User = require('../models/User')
const Note = require('../models/Note')
//const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc get all users
// @route GET/users
// @access private

const getAllUsers = /* asyncHandler( */async (req,res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message : 'no users found'})
    }
    res.json(users)
 
}/* ) */
// @desc create a user
// @route POST/users
// @access private

const createNewUser = /* asyncHandler( */async (req,res) => {
    const {username, password, roles} = req.body

    //confirm data
    if(!username || !password /* || !Array.isArray(roles) || !roles.length */){
        return res.status(400).json({message : 'All fields are required'})
    }

    //checking duplicate 
    //409 conflict
    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()
    //.collation check the case insensivity for duplicate users 
    if(duplicate){
        return res.status(409).json({message : 'username already exist'})
    }

    //Hash password encrypt
    const  hashPassword = await bcrypt.hash(password,10) //salt rounds 

    //user object structure 
    /* const userObject = {
        username, 'password' : hashPassword, roles
    } */
    const userObject = (!Array.isArray(roles) || !roles.length) ? {username, "password" : hashPassword} : {username, "password" : hashPassword, roles}

    //create and store new user
    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message : `New user ${username} created`})
    } else {
        res.status(400).json({message : `Invalid user date received`})
    } 
}/* ) */
// @desc update a user
// @route GET/users
// @access private

const updateUser = /* asyncHandler( */async (req,res) => {
    const {id, username, roles, active, password } = req.body
    //confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message : 'All fields are required'})        
    }
    
    //here we doesn't use lean because mongoDB need real format data to save doc
    const user = await User.findById(id).exec()
    if(!user && !user?._id.length < 23){
        return res.status(400).json({message : 'User not found'})
    } 

    //checking duplicate
    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()
    if(duplicate && duplicate?._id .toString() !== id){
        return res.status(409).json({message : 'Duplicate username'})
    }

    user.username = username 
    //hash  
    if(password){
        user.password = await bcrypt.hash(password, 10) // salt round
    }
    user.roles = roles
    user.active = active

    const updateUser = await user.save()
    res.json({message : `Username ${updateUser.username} is updated sucessfully`})
}/* ) */


// @desc delete a user
// @route DELETE/users
// @access private

const deleteUser = /* asyncHandler( */async (req,res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message : `User ID is reqired`})
    }
    const note = await Note.findOne({user:id}).lean().exec()
    if(note){
        return res.status(400).json({message : 'For this user as assigned some task'})
    }

    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message : 'User not found'})
    }
    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)

}/* ) */

module.exports = {getAllUsers, createNewUser, updateUser, deleteUser}