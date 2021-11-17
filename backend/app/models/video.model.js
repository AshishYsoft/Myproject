const mongoose = require("mongoose");

const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    video: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    is_delete: { type: Boolean, default: false },
    date : { type : Date, default: Date}
  })
);

module.exports = Video;