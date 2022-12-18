const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
   
    companyName : {
        type : String,
        required : [true, "Enter company name:"],
    },

    title : {
        type : String,
        required : [true, "Enter job role: "],
    },

    salary : {
        type : String,
        required : [true, "Enter salary range: "],
        enum : ["negotiable", "$24000-$50000", "$50000-$10000", "$10000-$250000"]
    },
   
    category : {
        type : String,
        required : [true, "Please enter the job category:"],
        enum : ['Product Designer', 'Technical Writer',  'Scrum Master', 'Data Analyst',
         'Backend Engineer', 'Frontend Developer', 'Business Analyst', 'Full-stack Developer']
    },
    
    location : {
        type : String,
        required : [true, "Enter the job location:"],
        enum : ["Lagos", "Ibadan", "Abuja", "Mexico", "Canada"]
    },
    address : {
        type : String
    },
 
    description : {
        type : String,
        required : [true, "Please enter the job description"]
    },
    
    experience : {
        type : String,
        required: [true, "Please enter work experience required for the job"],
        emum : ["No experience", "1 year", "2 years", "3 years", "4 years" , "5+ years"]
    },
  
    jobType :{
        type : String,
        required : [true, "Please enter the work type"],
        enum : ["Full Time", "Part Time", "Internship"]
    },

    keyword: {
        type: String,
        required: [true, 'Please enter keyword'],
        enum: ['remote ', 'full stack developer',  'data analyst', 
        'scrum master', 'technical writer', 'product designer', ' backend developer', 
        'fulltime', 'frontend developer'],
    },

    createdAt : {
        type : Date,
        default : Date.now(),
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;