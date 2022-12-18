const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter your full name']
    },

    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: [true, 'User with this email address already exists!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid Email address'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [8, 'Password must be at least 6 characters'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password!'],
        minLength: [6, 'Password must be at least 6 characters'],
          select: false,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please input your phone number']
    },
    skill: {
        type: String,
        enum: ['Product Designer', 'Technical Writer',  'Scrum Master', 'Data Analyst',
         'Backend Engineer', 'Frontend Developer', 'Business Analyst', 'Full-stack Developer'],
        required: [true, 'Please input your skill']
    },
    experience: {
        type: String,
        emum : ["No experience", "1 year" , " 2 years ", "3 years", "4 years", "5+ years"],
    },
    location : {
        type : String,
    },
    role : {
        type : String,
        default : "employee",
        enum : ["employee", "employer", "admin"]
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User