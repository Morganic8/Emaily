const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin.js');
const requireCredits = require('../middlewares/requireCredits');

//Mailer Class
const Mailer = require('../services/Mailer');
//Template for email
const surveyTemplate = require('../services/emailTemplates.js/surveyTemplates');

//If you need to test, dont require a mongoose model it everywhere
// mongoose may complain about it
const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!')
  })


  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    //send email
    //insert survey data and html template for email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      //req.user becomes stale we need the result of "save" to be stored in a new 'user' var
      const user = await req.user.save();

      //here's the new value of credits
      res.send(user);
    } catch (err) {
      res.status(422).send(err)
    }
  });
};

//_user relationship field