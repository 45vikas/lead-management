const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    firstName: String,
    email: String,
    phone: String,
    status: {
      type: String,
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);