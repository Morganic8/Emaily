const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

//fire off MongoDB models
require('./models/User');
require('./models/Survey');
//fire off passport
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
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //Express will serve production assets
  //like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  //Express will serve up the index.html file
  //if it doesn't recognize the route
  //catch all case if no route is found on Express or React Router
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


const PORT = process.env.PORT || 5000;

app.listen(PORT);
