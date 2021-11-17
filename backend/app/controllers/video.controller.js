exports.VideoAdd = (req, res) => {
  if (req.files && req.body) {
    let new_video = new Video();
    new_video.video = req.files[0].filename;
    new_video.user_id = req.user.id;
    new_video.save(function(err, data)  {
      if (err) {
        res.status(400).json({errorMessage: err, status: false});
      } else {
        res.status(200).json({status: true, title: 'Video Added successfully.'});
        console.log(req.files);
      }
    });
  } 
};

exports.VideoEdit = (req, res) => {
  if (req.files && req.body && req.body.id ) {
    Video.findById(req.body.id, function(err, new_video)  {
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
  }
}

exports.VideoDelete = (req, res) => {
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
}

exports.VideoGet = (req, res) => {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
    is_delete: false,
    user_id: req.user.id
  });

  var perPage = 5;
  var page = req.query.page || 1;
  Video.find(query, { date: 1, id: 1, video: 1 })
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
}