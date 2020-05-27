const { Path } = require('path-parser');
const { URL } = require('url');
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

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false });

    res.send(surveys);

  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!')
  });

  //ngrok server for dev ----- heroku for prod
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    const events = req.body.map(({ email, url }) => {
      //{ surveyId: '5ecd9b65914f300747df4450', choice: 'yes' }
      //console.log(p.test(pathname));
      const match = p.test(new URL(url).pathname);

      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice }
      }
    });

    let compactEvents = events.filter(Boolean);
    compactEvents = compactEvents.filter((value, i, self) =>
      i === self.findIndex((t) => (
        t.email === value.email && t.surveyId === value.surveyId
      ))
    )
    compactEvents.forEach(({ surveyId, email, choice }) => {
      Survey.updateOne({
        //mongo id is always _id
        _id: surveyId,
        recipients: {
          $elemMatch: { email: email, responded: false }
        }
      }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }).exec();
    })
    res.send({});
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