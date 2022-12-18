
const Job = require("../models/job");
const { handleErrors } = require("../utils/jobErrorHandler");
const QueryMethod = require("../utils/query");

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, jobType, salary, category, experience, keyword, companyName} = req.body;
    const newJob = new Job({ title, description, location, jobType, salary, category, experience, keyword, companyName });
    await newJob.save();
    return res.status(201).send({
      status: true,
      message: "Job Created Successfully!",
      data: newJob,
    });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

exports.updateJob = async (req, res) => {
  const id = req.params.id;
  const findJob = await Job.findById(id);
  findJob.title = req.body.title;
  findJob.description = req.body.description;
  findJob.location = req.body.location;
  findJob.jobType = req.body.jobType;
  findJob.salary = req.body.salary;
  findJob.category = req.body.category;
  await findJob.save();
  return res.status(200).send({
    status: true,
    message: "Job Updated Successf`ully!",
    data: findJob,
  });
};


exports.getOneJob = async (req, res) => {
  try {
    const id = req.params.id;
    const findOneJob = await Job.findById(id);

    if (!findOneJob) {
      return res.status(404).send({
        status: false,
        message: "Job Not Found",
      });
    } else {
      return response.status(200).send({
        status: true,
        message: "Job Found",
        Blog: findOneJob,
      });
    }
  } catch (err) {
    if (err.path === "_id") {
      return res.status(401).send({
        status: false,
        message: "Invalid ID",
      });
    } else {
      return res.status(500).send({
        status: false,
        message: "Server Error",
      });
    }
  }
};


// Get jobs based on Location, Keywords
exports.getAllJob = async (req, res) => {
  try {
    let queriedJob = new QueryMethod(Job.find(), req.query)
      .sort()
      .filter()
      .limit()
      .paginate();
    let job = await queriedJob.query;
    res.status(200).json({
      status: "success",
      results: job.length,
      data: job,
    });
  } catch (err) {
    const error = handleErrors(err);
    return response.status(400).json({ error });
  }
};

// Recommend jobs with user skills
exports.recommendJobs = async (req, res) => {
  try {
    const user = req.user;
    let job = await Job.find({ keywords: user.skills });
    res.status(200).json({
      status: "success",
      results: job.length,
      data: job,
    });
  } catch (err) {
    const error = handleErrors(err);
    return response.status(400).json({ error });
  }
};

exports.deleteJob = async (request, response) => {
  const id = request.params.id;
  const findJob = await Job.findByIdAndDelete(id);
  if (findJob) {
    return response.status(200).send({
      status: true,
      message: "Job deleted successfully",
    });
  } else {
    return response.status(409).send({
      status: false,
      message: "Job not found",
    });
  }
};
