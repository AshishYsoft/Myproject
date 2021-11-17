exports.userBoard = (req, res) => {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
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
};

exports.adminBoard = (req, res) => {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });
  if (req.query && req.query.search) {
    query["$and"].push({
      name: { $regex: req.query.search }
    });
  }
  var perPage = 5;
  var page = req.query.page || 1;
  User.find(query, { date: 1, email: 1, username: 1, password: 1, roles: 1, status: 1, confirmationCode: 1 })
    .skip((perPage * page) - perPage).limit(perPage)
    .then(function(data)  {
      User.find(query).count()
        .then(function(count)  {
          if (data && data.length > 0) {
            res.status(200).json({status: true, title: 'User retrived.', users: data, current_page: page, total: count, pages: Math.ceil(count / perPage)});
          } else {
            res.status(400).json({errorMessage: 'There is no user!', status: false });
          }
        });

}).catch(function(err)  {
  res.status(400).json({errorMessage: err.message || err, status: false });
  });
};