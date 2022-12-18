const express = require("express");
const jobController = require("../controllers/job");
const { auth, checkUser } = require("../middleware/authMiddleware");
const app = express();

const router = express.Router();

const { createJob, updateJob, getAllJob, getOneJob, deleteJob, recommendJobs } =
  jobController;
router
  .route("/")
  .post(auth,  createJob)
  .get(auth, getAllJob);

router.get("/recommend-jobs", auth, recommendJobs);
router.delete("/:id", auth, checkUser("admin"), deleteJob);

router.get("/:id", auth, getOneJob);

router.put("/:id", auth, updateJob);
module.exports = router;
