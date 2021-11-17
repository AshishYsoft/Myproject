const mongoose = require("mongoose");

const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    image: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    is_delete: { type: Boolean, default: false },
    date: { type : Date, default: Date}
  })
);

module.exports = Image;