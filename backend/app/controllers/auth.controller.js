const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken} = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: token,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({message: "User was registered successfully! Please check your email."});
            nodemailer.sendConfirmationEmail(
              user.username,
              user.email, 
              user.confirmationCode
            );
            res.redirect("/");
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully! Please check your email"});

          nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationCode
          );
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async(err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        status: user.status,
        refreshToken: refreshToken
      });
    });
  };

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
  .then((user) => {
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.status = "Active";
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(user);
        return;
      }
    });
  })
  .catch((e) => console.log("error", e));
};

exports.refreshToken = async(req, res) => {
  const { refreshToken: requestToken} = req.body;

  if(requestToken == null){
    return res.status(403).json({ message: "Refresh Token is required"});
  }

  try{
    let refreshToken = await RefreshToken.findOne({ token: requestToken});

    if(!refreshToken){
      res.status(401).json({ message: "Refresh token is not in database"});
      return;
    }

    if(RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify: false}).exec();
      res.status(403).json({ message: "Refresh Token was expired. Please login again."});
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id}, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch(err){
    return res.status(500).send({ message: err});
  }
}
