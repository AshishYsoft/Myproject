const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const config = require("./app/config/auth.config");
const jwt = require("jsonwebtoken");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

const dir = './uploads';
const upload = multer({ storage: multer.diskStorage({
  destination: function (req, file, callback) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, './uploads');
  },
  filename: function (req, file, callback) { 
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
  }
}),

fileFilter: function (req, file, callback) {
  const ext = path.extname(file.originalname)
  if (ext !== '.mp4' && ext!== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
    return callback( null, false)
  }
  callback(null, true)
  }
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const Image = db.image;
const Video = db.video;
const User = db.user;

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/image.routes")(app);
require("./app/routes/video.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/get-user", function(req, res) {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });
  var perPage = 5;
  var page = req.query.page || 1;
  User.find(query, { date: 1, email: 1, username: 1, password: 1, roles: 1, status: 1, confirmationCode: 1 }).sort({ date: -1 })
    .skip((perPage * page) - perPage).limit(perPage)
    .then(function(data) {
      User.find(query).count()
      .then(function(count)  {
      if (data && data.length > 0) {
        res.status(200).json({status: true, title: 'User retrived.', users: data, current_page: page, total: count, pages: Math.ceil(count / perPage)});
      }else {
        res.status(400).json({errorMessage: 'There is no user!', status: false });
      }
    });
  })
});

app.post("/add-user", function(req, res) {
  if (req.body) {
    const token = jwt.sign({ email: req.body.email }, config.secret);
    let new_user = new User();
    new_user.username = req.body.username;
    new_user.email = req.body.email,
    new_user.password = bcrypt.hashSync(req.body.password, 8),
    new_user.roles = req.body.roles;
    new_user.status = req.body.status;
    new_user.confirmationCode = token;
    new_user.save(function(err, data)  {
      if (err) {
        res.status(400).json({errorMessage: err, status: false});
      } else {
        res.status(200).json({status: true, title: 'User Added successfully.'});
        console.log(req.body);
      }
    });
    } 
})

app.post("/delete-user", function(req, res) {
  if (req.body.id) {
    User.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, function(err, data)  {
      if (data.is_delete) {
        res.status(200).json({status: true, title: 'User deleted.'});
      } else {
        res.status(400).json({errorMessage: err, status: false});
        console.log(req.body);
      }
    });
  } 
})

app.get('/edit/:id', function(req, res, next) {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
});

app.put('/update/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
  if (error) {
      console.log(error);
      return next(error);
  } else {
      res.json(data)
      console.log('User updated successfully !');
    }
  })
});

app.delete('/delete/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    }else {
      res.status(200).json({msg: data});
      console.log("User deleted");
    }
  })
});

app.post("/add-image", upload.any(), function(req, res)  {
  if (req.files && req.body) {
    let new_image = new Image();
    new_image.image = req.files[0].filename;
    new_image.save(function(err, data)  {
      if (err) {
        res.status(400).json({errorMessage: err, status: false});
      } else {
        res.status(200).json({status: true, title: 'Image Added successfully.'});
        console.log(req.files);
      }
    });
  } 
});

app.post("/add-video", upload.any(), function(req, res)  {
  if (req.files) {
    let new_video = new Video();
    new_video.video = req.files[0].filename;
    new_video.save(function(err, data)  {
      if (err) {
        res.status(400).json({errorMessage: err, status: false});
      } else {
        res.status(200).json({status: true, title: 'Video Added successfully.'});
        console.log(req.files);
      }
    });
  } 
});

app.post("/update-image", upload.any(), function(req, res) {
  if (req.files && req.body && req.body.id ) {
    Image.findById(req.body.id, function(err, new_image)  {
      if (req.files && req.files[0] && req.files[0].filename && new_image.image) {
        var path = `./uploads/${new_image.image}`;
        fs.unlinkSync(path);
      }
      if (req.files && req.files[0] && req.files[0].filename) {
        new_image.image = req.files[0].filename;
      }
      new_image.save(function(err, data)  {
        if (err) {
          res.status(400).json({errorMessage: err, status: false});
        } else {
          res.status(200).json({status: true, title: 'Image updated.'});
        }
      });
    });
  }
});

app.post("/update-video", upload.any(), function(req, res) {
  try {
    if (req.files && req.body && req.body.id ) {
      Video.findById(req.body.id, function(err, new_video) {
        if (req.files && req.files[0] && req.files[0].filename && new_video.video) {
          var path = `./uploads/${new_video.video}`;
          fs.unlinkSync(path);
        }
        if (req.files && req.files[0] && req.files[0].filename) {
          new_video.video = req.files[0].filename;
        }
        new_video.save(function(err, data)  {
          if (err) {
            res.status(400).json({errorMessage: err, status: false});
          } else {
            res.status(200).json({status: true, title: 'Video updated.'});
          }
        });
      });
    } else {
      res.status(400).json({errorMessage: 'Add proper parameter first!', status: false});
    }
  } catch (e) {
    res.status(400).json({errorMessage: 'Something went wrong!',status: false});
  }
});

app.post("/delete-image", function(req, res) {
  if (req.body && req.body.id) {
    Image.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, function(err, data)  {
      if (data.is_delete) {
        res.status(200).json({status: true, title: 'Image deleted.'});
      } else {
        res.status(400).json({errorMessage: err, status: false});
        console.log(req.body);
      }
    });
  } 
});

app.post("/delete-video", function(req, res) {
  if (req.body && req.body.id) {
    Video.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, function(err, data)  {
      if (data.is_delete) {
        res.status(200).json({status: true, title: 'Video deleted.'});
      } else {
        res.status(400).json({errorMessage: err, status: false});
        console.log(req.body);
      }
    });
  } 
});

app.get("/get-image", function(req, res)  {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });

  var perPage = 5;
  var page = req.query.page || 1;
  Image.find(query, { id: 1, image: 1 }).sort({ date: -1 })
    .skip((perPage * page) - perPage).limit(perPage)
    .then(function(data)  {
      Image.find(query).count()
      .then(function(count)  {
        if (data && data.length > 0) {
          res.status(200).json({status: true, title: 'Image retrived.', images: data, current_page: page, total: count, pages: Math.ceil(count / perPage)});
        }
      });
    }).catch (function(err)  {
    res.status(400).json({errorMessage: err.message || err, status: false });
  });
});

app.get("/get-images", function(req, res)  {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });
  Image.find(query, { id: 1, image: 1 }).sort({ date: -1 })
    .then(function(data)  {
      Image.find(query).count()
      .then(function(count)  {
        if (data && data.length > 0) {
          res.status(200).json({status: true, title: 'Image retrived.', images: data});
        }
      });
    }).catch (function(err)  {
    res.status(400).json({errorMessage: err.message || err, status: false });
  });
});

app.get("/get-video", function(req, res)  {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });

  var perPage = 5;
  var page = req.query.page || 1;
  Video.find(query, { id: 1, video: 1 }).sort({ date: -1 })
    .skip((perPage * page) - perPage).limit(perPage)
    .then(function(data)  {
      Video.find(query).count()
        .then(function(count)  {
          if (data && data.length > 0) {
            res.status(200).json({status: true, title: 'Video retrived.', videos: data, current_page: page, total: count, pages: Math.ceil(count / perPage)});
          }
        });
    }).catch (function(err)  {
    res.status(400).json({errorMessage: err.message || err, status: false });
  });
});

app.get("/get-videos", function(req, res)  {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });

  Video.find(query, { id: 1, video: 1 }).sort({ date: -1 })
    .then(function(data)  {
      Video.find(query).count()
        .then(function(count)  {
          if (data && data.length > 0) {
            res.status(200).json({status: true, title: 'Video retrived.', videos: data});
          }
        });
    }).catch (function(err)  {
    res.status(400).json({errorMessage: err.message || err, status: false });
  });
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}