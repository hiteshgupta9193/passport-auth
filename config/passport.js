const LocalStrategy = require('passport-local').Strategy;
const User = require('../modules/auth/user.model');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
    (req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ 'email': email }, (err, user) => {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, { 'signupMessage': 'That email is already in use.' });
          } else {
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save((err) => {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
    (req, email, password, done) => {
      User.findOne({ 'email': email }, (err, user) => {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, { 'loginMessage': 'No user found.' });
        if (!user.validPassword(password))
          return done(null, false, { 'loginMessage': 'Wrong password.' });
        return done(null, user);
      });
    }));
};