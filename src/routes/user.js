const express = require("express");
const User = require("../controllers/user");
const { auth, checkUser } = require("../middleware/authMiddleware");
const app = express();

const router = express.Router();

const { updateUser, getUser, getAllUsers, deleteUser } = User;

router.route("/").get(auth, checkUser("admin") , getAllUsers);
router
  .route("/:id")
  .get(auth, getUser)
  .put( auth, updateUser)
  .delete(auth, checkUser("admin"), deleteUser);

module.exports = router;
