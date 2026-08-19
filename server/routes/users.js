const express = require("express");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const { bio, name } = req.body;
    const update = {};

    if (typeof bio === "string") update.bio = bio.slice(0, 500);
    if (typeof name === "string" && name.trim()) update.name = name.trim();

    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;
