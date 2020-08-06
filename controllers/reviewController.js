const Review = require('./../models/reviewModel');

const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.setTourUserIds = (req, res, next) => {
  //this is to automatically set the id of the user and the tour fields, Allow the nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
