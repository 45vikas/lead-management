const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    firstName: String,
    phone: String,
    notes: String,
    status: { type: String, default: "New" }, // ✅ ADD THIS
  },
  { _id: true } // ✅ IMPORTANT
);

const DistributedSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    items: [ItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistributedList", DistributedSchema);