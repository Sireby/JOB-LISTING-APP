const User = require("../models/user");
const Job = require("../models/job");
const jobApplication = require("../models/jobApplication");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");

const multerStorage = multer.diskStorage({});

const upload = multer({ storage: multerStorage });

exports.uploadCV = upload.single("cv");

exports.selectCV = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      page: "1-2",
    });

    const cvName = result.url;
    req.body.cv = cvName;
    req.body.cloudinary_id = result.public_id;
    next();
  } catch (err) {
    console.log("An error occured", err);
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const { job, cv, cloudinary_id } = req.body;
    const user = req.user;
    const findJob = await Job.findById(job);
    if (!findJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const newUserJob = await jobApplication.create({
      user,
      job,
      cv,
      cloudinary_id,
    });

    res.status(201).json({
      status: true,
      mesaage: "Application Successful!",
      data: newUserJob,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Incomplete requirements" });
  }
};


exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationID = req.params.id;
    const findApplication = await jobApplication.findById(applicationID);
    const user = req.user;
    if (findApplication) {
      const newStatus = status;
      const updatedApplication = await jobApplication.findByIdAndUpdate(
        applicationID,
        {
          status: newStatus,
        },
        { new: true }
      );

      res.status(200).json({
        status: true,
        message: "Job status updated successfully",
        data: updatedApplication,
      });
    } else {
      res.status(401).json({ message: "Job applicatio0n not found" });
    }
  } catch (err) {
    res.status(400).json({ mesaage: "Provide Necessary Information!" });
  }
};



exports.getApplication = async (req, res) => {
  try {
    const application = req.params.id;
    const user = req.user;

    const findApplication = await jobApplication.findById({ application });

    if (findApplication) {
      res.status(200).json({
        status: true,
        message: "Application found",
        data: findUserJob,
      });
    } else {
      res.status(200).json({ status: "failed", message: "None found" });
    }
  } catch (err) {
    res.status(400).json({ mesaage: "Provide Necessary Information!" });
  }
};


exports.getAllApplications = async (req, res) => {
    try {
      const findAllApplications = await jobApplication.find();
      return res.status(200).send({
        status: true,
        message: "Applications found",
        AllUsers: findAllApplications,
      });
    } catch (err) {
      return res.status(404).send({
        status: false,
        message: "No Applications found",
      });
    }
  };


// exports.getAllApplications = async (req, res) => {
//   try {
//     const user = req.user;

//     const findApplication = await jobApplication.find({ user: user.id });

//     if (findUserJob) {
//       response.status(200).json({
//         status: true,
//         message: "All User's job application found",
//         quantity: findUserJob.length,
//         data: findUserJob,
//       });
//     } else {
//       response.status(200).json({ status: "failed", message: "None found" });
//     }
//   } catch (err) {
//     response.status(400).json({ mesaage: "Incomplete requirements" });
//   }
// };
