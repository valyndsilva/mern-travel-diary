const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  try {
    // Generate new password
    const salt = await bcrypt.genSalt(10); // create salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // hash password

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // Save user and send response
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
    // res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    // Check if user exists
    !user && res.status(400).json("Wrong username or password!");
    // Validate password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !isPasswordValid && res.status(400).json("Wrong username or password!");
    // Send response
    res.status(200).json({_id:user._id, username: user.username});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
