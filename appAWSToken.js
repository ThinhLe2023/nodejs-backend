const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan')
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
passport.use(require('./config/passport'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
  authorizationURL: `https://${config.COGNITO_DOMAIN}/login`,
  tokenURL: `https://${config.COGNITO_DOMAIN}/oauth2/token`,
  clientID: config.COGNITO_APP_CLIENT_ID,
  clientSecret: config.COGNITO_APP_CLIENT_SECRET,
  callbackURL: config.COGNITO_APP_CLIENT_CALLBACK_URL
},
function (accessToken, refreshToken, profile, done) {
  let jwk = JSON.parse(config.COGNITO_JWK)
  let pem = jwkToPem(jwk)
  let payload = jwt.verify(accessToken, pem)
  let groups = payload['cognito:groups'] || []

  done(null, { groups: groups, accessToken: accessToken }) // Keep accessToken for passing to API calls
}))
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})

// handle authentication failed cases and redirect to login page
app.use((err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    res.redirect('/login')
  } else {
    next(err)
  }
})

app.get('/auth/cognito', passport.authenticate('oauth2'));

app.get('/auth/cognito/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/')
})



const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(logger('dev'));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/messages?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
