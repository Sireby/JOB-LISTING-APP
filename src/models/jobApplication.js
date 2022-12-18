const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  cv: {
    type: String,
    required: [true, " Please insert your CV"],
  },
  cloudinary_id: {
    type: String,
  },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied",
  },
});

module.exports = mongoose.model("jobApplication", jobApplicationSchema);
