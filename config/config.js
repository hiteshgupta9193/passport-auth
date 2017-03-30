module.exports = {
  authKeys: {
    facebookAuth: {
      clientID: '176504262858698',
      clientSecret: '5c6f7bbf5f403e2006ac711de73fa9d8',
      callbackURL: 'http://localhost:3003/api/auth/facebook/callback',
    },
    // twitterAuth: {
    //   consumerKey: 'sOM9aZpoEyNAXKqvEUHd2O7cN',
    //   consumerSecret: '6I1x0PgH41AxuqtAKcfRqYtWDMKNv0TBaaoegW3RP3o1ks7NPk',
    //   callbackURL: 'http://localhost:3003/api/auth/twitter/callback',
    // },
    googleAuth: {
      clientID: '221500317409-0q9q9r0l7ueo165qrkqkq6uv5pu2e0vn.apps.googleusercontent.com',
      clientSecret: '8MPHjWu_UYTuwZnZHTdIRUg_',
      callbackURL: 'http://localhost:3003/api/auth/google/callback',
    }
  },
  nodemailer: {
    'service': 'Gmail',
    'username': 'developer200391@gmail.com',
    'password': 'developer91'
  }
};
