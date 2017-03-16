const passport = require('passport');

exports.signup = (req, res, next) => {
  console.log('signup');
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.send({ msg: info }); }

    // req / res held in closure
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.send(user);
    });
  })(req, res, next);
}

exports.login = (req, res, next) => {
  console.log('login');
  passport.authenticate('local-login', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.send({ msg: info }); }

    // req / res held in closure
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.send(user);
    });
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  console.log('logout');
  req.logout();
  res.send({ msg: 'User successfully logged out' });
}