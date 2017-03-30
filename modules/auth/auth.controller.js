const passport = require('passport');
const smtpTransport = require('../../config/smtp');
const User = require('./user.model');

exports.signup = (req, res, next) => {
  console.log('signup');
  passport.authenticate('local-signup', (err, user, info) => {
    authCb(req, res, next, err, user, info);
  })(req, res, next);
}

exports.login = (req, res, next) => {
  console.log('login');
  passport.authenticate('local-login', (err, user, info) => {
    authCb(req, res, next, err, user, info);
  })(req, res, next);
}

exports.facebookLogin = (req, res, next) => {
  console.log('fb login');
  passport.authenticate('facebook', { scope: 'email' })(req, res, next);
}

exports.facebookLoginCb = (req, res, next) => {
  console.log('fb login cb');
  passport.authenticate('facebook', (err, user, info) => {
    authCb(req, res, next, err, user, info);
  })(req, res, next);
}

// exports.twitterLogin = (req, res, next) => {
//   console.log('twitter login');
//   passport.authenticate('twitter')(req, res, next);
// }

// exports.twitterLoginCb = (req, res, next) => {
//   console.log('twitter login cb');
//   passport.authenticate('twitter', (err, user, info) => {
//     authCb(req, res, next, err, user, info);
//   })(req, res, next);
// }

exports.googleLogin = (req, res, next) => {
  console.log('google login');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

exports.googleLoginCb = (req, res, next) => {
  console.log('google login cb');
  passport.authenticate('google', (err, user, info) => {
    authCb(req, res, next, err, user, info);
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  console.log('logout');
  req.logout();
  res.send({ msg: 'User successfully logged out' });
}

exports.getProfile = (req, res, next) => {
  console.log('getProfile');
  res.send({ user: req.user });
}

exports.sendMail = function (req, res, next) {
  let rand = Math.floor((Math.random() * 100000000) + 2564);
  let host = req.get('host');
  let link = "http://localhost:4500/auth/verifymail?userId=" + req.user._id + "&verifyToken=" + rand;
  
  let mailOptions = {
    from: 'noreply@project267.com',
    //to: req.user.email,
    to: 'hiteshgupta9193@gmail.com',
    subject: "Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.send({ "msg": "error" });
    } else {
      console.log("Message sent: " + response.message);
      User.findByIdAndUpdate(req.user._id, { verifyToken: rand }, function (err, user) {
        if (err) {
          res.send({ "msg": "error in operation" });
        }
        else {
          res.send({ "msg": "completed" });
        }
      });
    }
  });
}

exports.verifyMail = function (req, res, next) {
  let userId = req.query.userId;
  let verificationToken = parseInt(req.query.verifyToken);

  User.findById(req.user._id, function (err, user) {
    if (err) {
      res.send({ "msg": "user not foundn" });
    }
    else {
      if (user.verifyToken === verificationToken) {
        user.verified = true;
        user.verifyToken = null;

        user.save(function (err, updatedUser) {
          if (err) {
             res.send({ "msg": "user not updated" })
          }
          res.send(updatedUser);
        });
      }
    }
  });
}

function authCb(req, res, next, err, user, info) {
  if (err) { return next(err); }
  if (!user) { return res.send({ msg: info }); }

  // req / res held in closure
  req.logIn(user, (err) => {
    if (err) { return next(err); }
    return res.send(user);
  });
}