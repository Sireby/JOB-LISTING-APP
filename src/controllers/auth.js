const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { createToken } = require("../middleware/authMiddleware");
const Token = require("../models/token");
const { handleErrors } = require("../utils/errorHandler");
//const { email } = require("../utils/email");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const maxAge = 3 * 24 * 60 * 60;

exports.register = async (req, res) => {
    try {
      const { name, email, password, confirmPassword, skill, experience, location ,phoneNumber,  role } = req.body;
      if (password !== confirmPassword) {
        res.status(400).json({ message: "Password does not match" });
      }
      const salt = await bcrypt.genSalt(10);
  
      if (password === confirmPassword && password.length > 6) {
        const hash = await bcrypt.hash(password, salt);
        const user = await User.create({
          name,
          email,
          password: hash,
          confirmPassword: hash,
          skill,
          experience,
          phoneNumber,
          location,
          role,
        });
  
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        await new Token({
          userId: user._id,
          token: token,
          createdAt: Date.now(),
        }).save();
        return res.status(201).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      }
      return res
        .status(400)
        .json({ message: "Password is less than 6 characters" });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(404).json({ errors });
    }
  };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email , password })  
    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Invalid email or password",
        });
      }
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      status: "fail",
      message: errors,
    });
  }
};
//   const { email, password } = req.body;
//   try {
//     const findUser = await User.findOne({ email , password })
//     if (!findUser) {
//       res.status(400).json({ message: "Invalid details" });
//     }
//     const checkPassword = await bcrypt.compare(password, findUser.password);
//     if (!checkPassword) {
//       res.status(400).json({ message: "Invalid details" });
//     } else {
//       const token = createToken(findUser._id);
//       res.cookie("jwt", token, {
//         httpOnly: true,
//         maxAge: maxAge * 1000,
//       });
//       res
//         .status(200)
//         .json({ status: "success", Id: findUser._id, email: findUser.email });
//     }
//   } catch (err) {
//     const error = handleErrors(err);
//     res.status(400).json({ error });
//   }
// };

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "You've successfully logged out" });
  } catch (error) {
    res.status(404).json({ message: "Account not logged out" });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${token.token}`;
    await email({
      email: "nicoleojieabu@gmail.com",
      subject: "Password reset",
      text: link,
    });

    res.status(200).json({
      status: "success",
      message: "password reset link sent to your email account",
    });
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    const user = await User.findById(token.userId);
    if (!user) return res.status(400).send("User not found");
    if (req.body.password.length > 5) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
      user.confirmPassword = user.password;

      await user.save();
      await token.delete();

      res.send("password reset sucessfully.");
    }
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};
