const express = require('express');
const { signup, login } = require('../controllers/auth');
const { auth, isStudent, isAdmin } = require('../middleware/middle');

const router = express.Router();

router.post('/login', login)
router.post('/signup', signup)

router.get('/student', auth, isStudent, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Student Page'
    })
})

router.get('/admin', auth, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Admin Page'
    })
})

module.exports = router;