const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../modules/auth/user.model');
const appKeys = require('./config').authKeys;

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
            newUser.name = req.body.name;
            newUser.password = newUser.generateHash(password);
            newUser.save((err) => {
              if (err)
                return done(err);
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

  passport.use(new FacebookStrategy({
    clientID: appKeys.facebookAuth.clientID,
    clientSecret: appKeys.facebookAuth.clientSecret,
    callbackURL: appKeys.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function (err) {
              if (err)
                return done(err);
              return done(null, newUser);
            });
          }
        });
      });
    }));

  // passport.use(new TwitterStrategy({
  //   consumerKey: appKeys.twitterAuth.consumerKey,
  //   consumerSecret: appKeys.twitterAuth.consumerSecret,
  //   callbackURL: appKeys.twitterAuth.callbackURL,
  // },
  //   function (token, tokenSecret, profile, done) {
  //     process.nextTick(function () {
  //       User.findOne({ 'twitter.id': profile.id }, function (err, user) {
  //         if (err)
  //           return done(err);
  //         if (user) {
  //           return done(null, user);
  //         } else {
  //           var newUser = new User();
  //           newUser.twitter.id = profile.id;
  //           newUser.twitter.token = token;
  //           newUser.twitter.username = profile.username;
  //           newUser.twitter.displayName = profile.displayName;
  //           newUser.save(function (err) {
  //             if (err)
  //               return done(err);
  //             return done(null, newUser);
  //           });
  //         }
  //       });
  //     });
  //   }));

  passport.use(new GoogleStrategy({
    clientID: appKeys.googleAuth.clientID,
    clientSecret: appKeys.googleAuth.clientSecret,
    callbackURL: appKeys.googleAuth.callbackURL,
  },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'google.id': profile.id }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.save(function (err) {
              if (err)
                return done(err);
              return done(null, newUser);
            });
          }
        });
      });
    }));
};