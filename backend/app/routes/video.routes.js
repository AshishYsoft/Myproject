const controller = require("../controllers/video.controller");
const multer = require("multer");
const express = require("express");

module.exports = function(app) {
    const dir = '../uploads';
const upload = multer({ storage: multer.diskStorage({
  destination: function (req, file, callback) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, '../uploads');
  },
  filename: function (req, file, callback) { 
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
  }
}),

fileFilter: function (req, file, callback) {
  const ext = path.extname(file.originalname)
  if (ext !== '.mp4') {
    return callback( null, false)
  }
  callback(null, true)
  }
});

app.use(express.static('uploads'));

app.post("add-video", upload.any(), controller.VideoAdd);

app.post("update-video", upload.any(), controller.VideoEdit);

app.post("delete-video", controller.VideoDelete);

app.get("get-video", controller.VideoGet);
}