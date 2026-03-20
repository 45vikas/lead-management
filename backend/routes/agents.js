const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const DistributedList = require("../models/DistributedList");
const role = require("../middleware/role");

// ✅ ADD AGENT (ADMIN ONLY)
router.post("/", auth, role(["admin"]), async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const ag = new Agent({
      name,
      email,
      mobile,
      password: hashed,
    });

    await ag.save();

    res.json({ message: "Agent added ✅", agent: ag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LIST AGENTS (ADMIN ONLY - optional but recommended)
router.get("/", auth, role(["admin"]), async (req, res) => {
  try {
    const agents = await Agent.find().limit(100);
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE AGENT + RELATED LISTS (ADMIN ONLY)
router.delete("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    await DistributedList.deleteMany({ agent: req.params.id });

    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent and related lists deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;