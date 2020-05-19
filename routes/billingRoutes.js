const keys = require('../config/keys');
const stripe = require("stripe")(keys.stripeSecretKey)
//secure this particular route
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //send to stripe charge
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    })
    //save + 5 credits to DB
    req.user.credits += 5
    const user = await req.user.save();

    //send back to the browser
    res.send(user);
  })
};