module.exports = (req, res, next) => {
  //if no user, stop from accessing app
  if (req.user.credits < 1) {
    return res.status(403).send({ error: 'Not enough credits!' });
  }
  //good user, go to next middleware
  next();
};