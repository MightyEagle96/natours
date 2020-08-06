const express = require('express');
const multer = require('multer');
const User = require('./../models/userModel');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post(
  '/forgotPassword',
  authController.protect,
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:token',
  authController.protect,
  authController.resetPassword
);

//to fix in a middleware at this point to protect all the routes
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.get('/me', userController.getMe, userController.getUser);

//router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(authController.restrictTo('admin'), userController.deleteMe);

module.exports = router;
