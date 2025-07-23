const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.status(201).json({ token, user: { name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

router.post("/signup", async (req, res) => {
  const { name, email, password, accountType, businessName } = req.body;

  try {
    // 1. Check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Validate account type
    if (!["customer", "business"].includes(accountType)) {
      return res.status(400).json({ message: "Invalid account type" });
    }

    // 3. Require business name if account type is business
    if (accountType === "business" && !businessName) {
      return res.status(400).json({ message: "Business name is required for business accounts" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and save user
    user = new User({
      name,
      email,
      password: hashedPassword,
      accountType,
      businessName
    });

    await user.save();

    // 6. Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 7. Respond
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        businessName: user.businessName,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.status(200).json({
      token,
      user: {
        userId: user._id,     // ✅ Include userId here
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        accountType: user.accountType

      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
