const express = require("express");
const router = express.Router();
const DistributedList = require("../models/DistributedList");
const auth = require("../middleware/auth");

// ✅ TEST ROUTE (IMPORTANT)
router.get("/test", (req, res) => {
  res.json({ message: "Lead route working ✅" });
});



// ✅ UPDATE LEAD
router.put("/:listId/:itemId", auth, async (req, res) => {
  try {
    const { listId, itemId } = req.params;

    const list = await DistributedList.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Lead not found" });

    item.firstName = req.body.firstName || item.firstName;
    item.phone = req.body.phone || item.phone;
    item.status = req.body.status || item.status;

    await list.save();

    res.json({ message: "Lead updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed ❌" });
  }
});

// ✅ DELETE LEAD (FIXED)
router.delete("/:listId/:itemId", auth, async (req, res) => {
  try {
    const { listId, itemId } = req.params;

    const list = await DistributedList.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Lead not found" });

    // ✅ SAFE DELETE
    list.items = list.items.filter(
      (i) => i._id.toString() !== itemId
    );

    await list.save();

    res.json({ message: "Lead deleted successfully ✅" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed ❌" });
  }
});

module.exports = router;