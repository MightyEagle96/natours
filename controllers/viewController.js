const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');
const { render } = require('pug');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. get tour data from collection
  const tours = await Tour.find();
  //2. Build template

  //3. Render the template using the data from 1

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1. Get the tour based on the slug
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = async (req, res, next) => {
  //1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //to get all the tours that user booked
  // let tours = [];
  // //2. Find tours with the returned Ids
  // for (let i = 0; i < bookings.length; i++) {
  //   const tour = await Tour.findOne({ id: bookings[i].tour });
  //   tours.push(tour);
  // }

  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', { title: 'My booked tours', tours });
};
exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
