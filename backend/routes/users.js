const express = require("express");
const router = express.Router();

// CONTROLLER
const userController = require('../controller/users');

// AUTH MIDDLEWARE
const auth = require("../middleware/auth");

// express-validator middleware
const { check } = require('express-validator');

// @route   POST users/register
// @desc    Registers a user
// @access  Public
router.post('/register', [
    check('name', 'Please Add A Name!').not().isEmpty(),
    check('email', 'Please Add A Valid Email!').isEmail(),
    check('metaMaskAccount', 'MetaMask Account is inValid!').not().isEmpty()
], userController.postUserRegister);

// @route   POST users/login
// @desc    Login User
// @access  Public
router.post('/login', [
    check('metaMaskAccount', 'MetaMask Account is inValid!').not().isEmpty()
], userController.postUserLogin);

// @route   GET users/auth
// @desc    Get Authorized user's data
// @access  Private
router.get('/auth', auth, userController.getUserAuth);

// @route   PUT users/request-property
// @desc    Update Request Properties to user's data
// @access  Private
router.put('/request-property', auth, userController.putRequestProperty);

// @route   GET users/offered-properties
// @desc    Get Offered Properties of user
// @access  Private
router.get('/offered-properties', auth, userController.getOfferedProperties);

// @route   PUT users/cancel-request
// @desc    Remove Requested Property from user's data
// @access  Private
router.put('/cancel-property', auth, userController.cancelRequest);

// @route   PUT users/reject-request
// @desc    Reject Requested Property from owner's data
// @access  Private
router.put('/reject-property', auth, userController.rejectOffer);

// @route   PUT users/accept-request
// @desc    Accept Requested Property from owner's data
// @access  Private
router.put('/accept-property', auth, userController.acceptOffer);

// @route   PUT users/remove-accepted-offers
// @desc    Clear Offers and Reqests for given property
// @access  Private
router.put('/remove-accepted-offers', auth, userController.removeAcceptedOffers);

module.exports = router;