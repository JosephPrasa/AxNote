const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

// --- Utils ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- Middleware ---
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// --- Controllers ---

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please Enter all the Feilds');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('User not found');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
});

// @desc    Google Auth
// @route   POST /api/users/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { credential } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (error) {
        res.status(400);
        throw new Error('Google Sign-In Failed: Invalid Token');
    }

    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
        user.googleId = sub;
        if (picture && !user.pic) user.pic = picture;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        user = await User.create({
            name,
            email,
            googleId: sub,
            password: Math.random().toString(36).slice(-8),
            pic: picture
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
});

// @desc    Update User Profile
// @route   POST /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.pic) user.pic = req.body.pic;
        if (req.body.password) user.password = req.body.password;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            pic: updatedUser.pic,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User Not Found');
    }
});

// --- Routes ---
router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.route('/profile').post(protect, updateUserProfile).get(protect, (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        pic: req.user.pic,
    });
});

module.exports = router;
