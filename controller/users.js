require("dotenv").config();
const { getToken } = require("../utils/jwtToen");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validates, validateUser } = require("../Models/user");


let register = async (req, res) => {
  // checking the inputs using JOI
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // finding the user is already registred or not
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("username already exist");

  // create a new user to save
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  });

  try {
    await user.save();
    res.status(200).send("User Created !!!");
  } catch (err) {
    res.status(500).send(err);
  }
};

let login = async (req, res) => {
  try {
    const { error } = validates(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //   if (req.user) return res.send("User already logged in!");
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword)
      return res.status(400).send("Invalid email or password");

    const token = getToken({
      userId: user._id,
    });

    return res.status(200).json({
      message: "login successful",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  register,
};
