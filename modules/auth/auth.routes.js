const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('./auth.controller');

router.route('/signup')
  .post(authController.signup);

router.route('/login')
  .post(authController.login);

router.route('/facebook')
  .get(authController.facebookLogin);

router.route('/facebook/callback')
  .get(authController.facebookLoginCb);

router.route('/twitter')
  .get(authController.twitterLogin);

router.route('/twitter/callback')
  .get(authController.twitterLoginCb);

router.route('/google')
  .get(authController.googleLogin);

router.route('/google/callback')
  .get(authController.googleLoginCb);

router.route('/logout')
  .get(authController.logout);

router.get('/profile', isLoggedIn, (req, res) => {
  res.send({ user: req.user });
});

// router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

// router.get('/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
// }));

// router.get('/twitter', passport.authenticate('twitter'));

// router.get('/twitter/callback', passport.authenticate('twitter', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
// }));

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', passport.authenticate('google', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
// }));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send({ msg: 'Please login' });
}

module.exports = router;



