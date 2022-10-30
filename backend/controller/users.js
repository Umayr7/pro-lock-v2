const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
require("dotenv").config();

// MODELS
const User = require("../models/users");
const Offer = require("../models/offers");

// express-validator middleware
const { validationResult } = require('express-validator');

// Register User
exports.postUserRegister = async (req, res) => {
    const errors = validationResult(req);
    const { name, email, phone, metaMaskAccount } = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // Check if the User with this Email exists
        let userData = await User.findOne({email: email});

        if (userData) {
            return res.status(400).json({ msg: "Employee Already Exists!" });
        } else {
            let user = new User();
            user.name = name;
            user.email = email;
            user.metaMaskAccount = metaMaskAccount;
            user.phone = phone;

            await user.save();

            let payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 36000
            }, (err, token) => {
                if (err) throw err;

                res.status(200).json({token});
            })
        }
    } catch (err) {
        res.status(500).json({ msg: "NODE::Server Error", errors: err });
    }
};

exports.postUserLogin = async (req, res) => {
    const errors = validationResult(req);
    const { metaMaskAccount } = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // Check if the User with this Email exists
        let user = await User.findOne({metaMaskAccount: metaMaskAccount});

        if (!user) {
            return res.status(400).json({ msg: "Employee Does not Exist!" });
        } else {
            // let isMatch = await bcrypt.compare(password, user.password);

            // if(!isMatch) {
            //     return res.status(400).json({ msg: "Invalid Password!" });
            // } else {
                let payload = {
                    user: {
                        id: user.id
                    }
                }
    
                jwt.sign(payload, config.get('jwtSecret'), {
                    expiresIn: 36000
                }, (err, token) => {
                    if (err) throw err;
    
                    req.session.user = user.id;
                    req.session.save((err) => {
                        if (err) throw err;

                        res.status(200).json({token});
                    });
                    
                })
            // }
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
}

exports.getUserAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
};

exports.putRequestProperty = async (req, res) => {
    const { propertyTokenId, ownerId, requesterId, bid } = req.body;
    const date = new Date();
    const noTimezoneDate = date.toISOString().slice(0, -1);
    
    try {
        // Adding Request data to requester's record
        const requestPayload = {
            status: 'requested', 
            propertyTokenId: propertyTokenId,
            ownerId: ownerId,
            bid: bid,
            created_at: noTimezoneDate
        };
        
        await User.updateOne(
            { _id: req.user.id }, 
            { $push: 
                { requests:  requestPayload},
            }
        );

        // Adding Request data to owner's record
        const offerPayload = {
            status: 'pending', 
            propertyTokenId: propertyTokenId, 
            requesterId: requesterId,
            ownerId: ownerId,
            bid: bid,
            created_at: noTimezoneDate
        };

        let userOffers = await Offer.findOne({userId: ownerId, tokenId: propertyTokenId});

        if (userOffers !== null) {
            await Offer.updateOne(
                { userId: ownerId, tokenId: propertyTokenId }, 
                { $push: 
                    { offers:  offerPayload},
                }
            );
        } else {
            let offerList = [offerPayload];

            let offer = new Offer();
            offer.userId = ownerId;
            offer.tokenId = propertyTokenId;
            offer.offers = offerList;

            await offer.save();
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
}

exports.getOfferedProperties = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const offers = await Offer.find({userId: user.metaMaskAccount});

        res.status(200).json(offers);
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
}

exports.cancelRequest = async (req, res) => {
    const { userId, ownerId, propertyTokenId} = req.body;
    
    try {
        // Finding Requester with requested property
        let user = await User.findOne({
            _id: userId,
            requests: {
                $elemMatch: {
                    propertyTokenId: propertyTokenId,
                    ownerId: ownerId
                }
            }
        });

        if (user) {
            // Cancel request from requester
            var userRequests = user.requests;
            for (var i = 0 ; i < userRequests.length ; i++ ) {
                if (userRequests[i].propertyTokenId === propertyTokenId) {
                    userRequests.splice(
                        userRequests.findIndex(
                            obj => obj.propertyTokenId === propertyTokenId
                        ), 
                        1
                    );
                    break;
                }
            }

            await User.updateOne(
                { _id: req.user.id }, 
                { $set: 
                    { requests:  userRequests},
                }
            );

            // Removing request offer from owner
            let offer = await Offer.findOne({
                userId: ownerId,
                tokenId: propertyTokenId
            });

            if (offer) {
                var offerList = offer.offers;
                
                for (var j = 0 ; j < offerList.length ; j++) {
                    if (offerList[j].requesterId === user.metaMaskAccount) {
                        offerList.splice(
                            offerList.findIndex(
                                obj => obj.requesterId === user.metaMaskAccount
                            ), 
                            1
                        );
                        break;
                    }
                }
                await Offer.updateOne(
                    { ownerId: ownerId, tokenId: propertyTokenId }, 
                    { $set: 
                        { offers:  offerList},
                    }
                );

                let updatedOffers = await Offer.findOne({
                    userId: ownerId,
                    tokenId: propertyTokenId
                });

                if (updatedOffers) {
                    if (updatedOffers.offers.length === 0) {
                        await Offer.find({
                            userId: ownerId,
                            tokenId: propertyTokenId
                        }).remove();
                    }
                    let updateUser = await User.findById(req.user.id);
                    res.status(200).json(updateUser);
                } else {
                    res.status(400).json({ msg: "Offer Not Found" });
                }
            } else {
                res.status(400).json({ msg: "Offer Not Found" });
            }
        } else {
            res.status(400).json({ msg: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
}

exports.rejectOffer = async (req, res) => {
    const { userMetaMaskId  , requesterMetaMaskId, propertyTokenId} = req.body;
    
    try {
        // Finding Requester with requested property
        let user = await User.findOne({
            metaMaskAccount: requesterMetaMaskId,
            requests: {
                $elemMatch: {
                    propertyTokenId: propertyTokenId,
                    ownerId: userMetaMaskId
                }
            }
        });

        if (user) {
            // Cancel request from requester
            var userRequests = user.requests;
            for (var i = 0 ; i < userRequests.length ; i++ ) {
                if (userRequests[i].propertyTokenId === propertyTokenId) {
                    userRequests.splice(
                        userRequests.findIndex(
                            obj => obj.propertyTokenId === propertyTokenId
                        ), 
                        1
                    );
                    break;
                }
            }

            await User.updateOne(
                { metaMaskAccount: requesterMetaMaskId }, 
                { $set: 
                    { requests:  userRequests},
                }
            );

            // Removing request offer from owner
            let offer = await Offer.findOne({
                userId: userMetaMaskId,
                tokenId: propertyTokenId
            });

            if (offer) {
                var offerList = offer.offers;
                
                for (var j = 0 ; j < offerList.length ; j++) {
                    if (offerList[j].requesterId === requesterMetaMaskId) {
                        offerList.splice(
                            offerList.findIndex(
                                obj => obj.requesterId === user.metaMaskAccount
                            ), 
                            1
                        );
                        break;
                    }
                }

                await Offer.updateOne(
                    { userId: userMetaMaskId, tokenId: propertyTokenId }, 
                    { $set: 
                        { offers:  offerList},
                    }
                );

                let updatedOffers = await Offer.findOne({
                    userId: userMetaMaskId,
                    tokenId: propertyTokenId
                });

                if (updatedOffers) {
                    if (updatedOffers.offers.length === 0) {
                        await Offer.find({
                            userId: userMetaMaskId,
                            tokenId: propertyTokenId
                        }).remove();
                    }
                    let updateUser = await User.findById(req.user.id);
                    res.status(200).json(updateUser);
                } else {
                    res.status(400).json({ msg: "Offer Not Found" });
                }
            } else {
                res.status(400).json({ msg: "Offer Not Found" });
            }
        } else {
            res.status(400).json({ msg: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
};

exports.acceptOffer = async (req, res) => {
    const { userMetaMaskId  , requesterMetaMaskId, propertyTokenId} = req.body;
    
    try {
        // Finding Requester with requested property
        let user = await User.findOne({
            metaMaskAccount: requesterMetaMaskId,
            requests: {
                $elemMatch: {
                    propertyTokenId: propertyTokenId,
                    ownerId: userMetaMaskId
                }
            }
        });

        if (user) {
            // Cancel request from requester
            var userRequests = user.requests;
            for (var i = 0 ; i < userRequests.length ; i++ ) {
                if (userRequests[i].propertyTokenId === propertyTokenId) {
                    user.requests[i].status = 'approved'
                    break;
                }
            }

            await User.updateOne(
                { metaMaskAccount: requesterMetaMaskId }, 
                { $set: 
                    { requests:  userRequests},
                }
            );

            // Removing request of that property from other other records
            let remainingUsers = await User.find({
                requests: {
                    $elemMatch: {
                        propertyTokenId: propertyTokenId,
                        ownerId: userMetaMaskId,
                        status: 'requested'
                    }
                }
            });


            if (remainingUsers.length > 0) {
                var requestedList = remainingUsers;
                
                for (var k = 0 ; k < requestedList.length ; k++ ) {
                    // add another loop for requests array....
                    var requestsData = requestedList[k].requests;
                    for (var l = 0 ; l < requestsData.length ; l++) {
                        if (requestsData[l].propertyTokenId === propertyTokenId) {
                            requestsData.splice(
                                requestsData.findIndex(
                                    obj => obj.propertyTokenId === propertyTokenId
                                ), 
                                1
                            );
                            break;
                        }
                    }

                    await User.updateOne(
                        { metaMaskAccount: requestedList[k].metaMaskAccount }, 
                        { $set: 
                            { requests:  requestsData},
                        }
                    );
                    if (k === requestedList.length-1) {
                        break;
                    }
                }
            }

            // Removing request offer from owner
            let offer = await Offer.findOne({
                userId: userMetaMaskId,
                tokenId: propertyTokenId
            });

            if (offer) {
                var offerList = offer.offers;

                for (var j = 0 ; j < offerList.length ; j++) {
                    if (offerList[j].requesterId === requesterMetaMaskId) {
                        offer.offers[j].status = 'approved';
                        offerList = [offer.offers[j]];
                        break;
                    }
                }

                await Offer.updateOne(
                    { userId: userMetaMaskId, tokenId: propertyTokenId }, 
                    { $set: 
                        { offers:  offerList},
                    }
                );

                let updatedOffers = await Offer.findOne({
                    userId: userMetaMaskId,
                    tokenId: propertyTokenId
                });

                if (updatedOffers) {
                    if (updatedOffers.offers.length === 0) {
                        await Offer.find({
                            userId: userMetaMaskId,
                            tokenId: propertyTokenId
                        }).remove();
                    }
                    let updateUser = await User.findById(req.user.id);
                    res.status(200).json(updateUser);
                } else {
                    res.status(400).json({ msg: "Offer Not Found" });
                }
            } else {
                res.status(400).json({ msg: "Offer Not Found" });
            }
        } else {
            res.status(400).json({ msg: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
};

exports.removeAcceptedOffers = async (req, res) => {
    const { ownerMetamaskId, tokenId} = req.body;
    
    try {
        // Finding Requester with requested property
        let user = await User.findById(req.user.id);

        if (user) {
            // Remove request from requester
            var userRequests = user.requests;

            for (var i = 0 ; i < userRequests.length ; i++ ) {
                if (userRequests[i].propertyTokenId === tokenId) {
                    userRequests.splice(
                        userRequests.findIndex(
                            obj => obj.propertyTokenId === tokenId
                        ), 
                        1
                    );
                    break;
                }
            }

            await User.updateOne(
                { _id: req.user.id }, 
                { $set: 
                    { requests:  userRequests},
                }
            );

            // Removing request offer from owner
            let offer = await Offer.findOne({
                userId: ownerMetamaskId,
                tokenId: tokenId
            });

            if (offer) {
                var offerList = offer.offers;
                
                for (var j = 0 ; j < offerList.length ; j++) {
                    if (offerList[j].requesterId === user.metaMaskAccount) {
                        offerList.splice(
                            offerList.findIndex(
                                obj => obj.requesterId === user.metaMaskAccount
                            ), 
                            1
                        );
                        break;
                    }
                }

                await Offer.updateOne(
                    { userId: ownerMetamaskId, tokenId: tokenId }, 
                    { $set: 
                        { offers:  offerList},
                    }
                );

                let updatedOffers = await Offer.findOne({
                    userId: ownerMetamaskId,
                    tokenId: tokenId
                });

                if (updatedOffers) {
                    if (updatedOffers.offers.length === 0) {
                        await Offer.find({
                            userId: ownerMetamaskId,
                            tokenId: tokenId
                        }).remove();
                    }
                    let updateUser = await User.findById(req.user.id);
                    res.status(200).json(updateUser);
                } else {
                    res.status(400).json({ msg: "Offer Not Found" });
                }
            } else {
                res.status(400).json({ msg: "Offer Not Found" });
            }
        } else {
            res.status(400).json({ msg: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error", errors: err });
    }
}