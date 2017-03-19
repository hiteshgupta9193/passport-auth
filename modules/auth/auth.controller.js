const passport = require('passport');

exports.signup = (req, res, next) => {
  console.log('signup');
  passport.authenticate('local-signup', (err, user, info) => {
    authCb(req, res, next);
  })(req, res, next);
}

exports.login = (req, res, next) => {
  console.log('login');
  passport.authenticate('local-login', (err, user, info) => {
    authCb(req, res, next);
  })(req, res, next);
}

exports.facebookLogin = (req, res, next) => {
  console.log('fb login');
  passport.authenticate('facebook', { scope: 'email' });
}

exports.facebookLoginCb = (req, res, next) => {
  console.log('fb login cb');
  passport.authenticate('facebook', (err, user, info) => {
    authCb(req, res, next);
  })(req, res, next);
}

exports.twitterLogin = (req, res, next) => {
  console.log('twitter login');
  passport.authenticate('twitter');
}

exports.twitterLoginCb = (req, res, next) => {
  console.log('twitter login cb');
  passport.authenticate('twitter', (err, user, info) => {
    authCb(req, res, next);
  })(req, res, next);
}

exports.googleLogin = (req, res, next) => {
  console.log('google login');
  passport.authenticate('google', { scope: ['profile', 'email'] })
}

exports.googleLoginCb = (req, res, next) => {
  console.log('google login cb');
  passport.authenticate('google', (err, user, info) => {
    authCb(req, res, next);
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  console.log('logout');
  req.logout();
  res.send({ msg: 'User successfully logged out' });
}

function authCb(req, res, next) {
  if (err) { return next(err); }
  if (!user) { return res.send({ msg: info }); }

  // req / res held in closure
  req.logIn(user, (err) => {
    if (err) { return next(err); }
    return res.send(user);
  });
}