const express = require("express");
const jobApplication  = require("../controllers/jobApplication");
const { auth, checkUser } = require("../middleware/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const {
  applyForJob,
  updateApplicationStatus,
  getApplication,
  getAllApplications,
  uploadCV,
  selectCV,
} = jobApplication;
router
  .route("/")
  .post(auth, uploadCV, selectCV, applyForJob)
  .get(auth, getAllApplications);

router
  .route("/:id")
  .get(auth, getApplication)
  .put(auth, updateApplicationStatus);

module.exports = router;
