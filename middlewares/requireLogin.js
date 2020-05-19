module.exports = (req, res, next) => {
  //if no user, stop from accessing app
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in' });
  }
  //good user, go to next middleware
  next();
};