exports.ImageAdd = (req, res) => {
  if (req.files && req.body) {
    let new_image = new Image();
    new_image.image = req.files[0].filename;
    new_image.user_id = req.user.id;
    new_image.save(function(err, data)  {
      if (err) {
        res.status(400).json({errorMessage: err, status: false});
      } else {
        res.status(200).json({status: true, title: 'Image Added successfully.'});
        console.log(req.files);
      }
    });
  } 
};

exports.ImageEdit = (req, res) => {
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
}

exports.ImageDelete = (req, res) => {
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
}

exports.ImageGet = (req, res) => {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
    user_id : req.user.id
  });

  var perPage = 5;
  var page = req.query.page || 1;
  Image.find(query, { date: 1, id: 1, image: 1 })
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
}