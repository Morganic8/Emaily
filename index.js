const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
//fire off passport
require('./models/User');
require('./services/passport');

//mongoose options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
mongoose.connect(keys.mongoURI, options);

const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());

//google auth route
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app)



const PORT = process.env.PORT || 5000;

app.listen(PORT);
