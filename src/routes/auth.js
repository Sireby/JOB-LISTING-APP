const authController = require("../controllers/auth");
const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const {  register, login, logout, resetPassword, resetPasswordRequest } =
  authController;

router.post("/register", register);

router.post("/login", login);

router.post("/logout/:id", auth, logout);

router.post("/reset-password", resetPasswordRequest);

router.put("/reset-password/:token", resetPassword);

module.exports = router;
