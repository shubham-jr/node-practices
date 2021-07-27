const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

router.route('/logout').get(authController.logout);

router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router.route('/updateMyPassword').patch(authController.updatePassword);

router.route('/updateMe').patch(userController.updateMe);

router.route('/deleteMe/:id').delete(userController.deleteMe);

router.route('/me').get(userController.getMe,userController.getUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = router;