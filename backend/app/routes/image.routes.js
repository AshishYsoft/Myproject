const controller = require("../controllers/image.controller");
const multer = require("multer");
const express = require("express");
const path = require("path");
const fs = require("fs");

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
        if (ext!== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
        return callback( null, false)
        }
        callback(null, true)
        }
    });

module.exports = function(app) {
    
app.use(express.static('uploads'));

app.post("add-image", upload.any(), controller.ImageAdd);

app.post("update-image", upload.any(), controller.ImageEdit);

app.post("delete-image", controller.ImageDelete);

app.get("get-image", controller.ImageGet);

}