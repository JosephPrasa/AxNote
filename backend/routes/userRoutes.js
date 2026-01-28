const express = require('express');
const {
    registerUser,
    authUser,
    googleAuth,
    updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.route('/profile').post(protect, updateUserProfile).get(protect, (req, res) => {
    // Basic profile get
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        pic: req.user.pic,
    });
});

module.exports = router;
