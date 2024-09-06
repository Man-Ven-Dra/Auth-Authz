const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try{
        const  token  = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        if(!token) {
            res.status(401).json({
                success: false,
                message: 'User not Loged In',
            })
        }
        try {
            const payload = jwt.verify(token, process.env.JWT)
            console.log(payload);
            req.user = payload;
        }
        catch (err) {
            console.log(err);
            res.status(401).json({
                success: false,
                message: 'Token is Invalid',
            })
        }
    next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
            data : 'Failure'
        })
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if( req.user.role !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'Not Allowed to Access Student Page'
            })
        }
    next();    
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
            data : 'User Role cannot be Verified'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if( req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not Allowed to Access Admin Page'
            })
        }
    next();  
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
            data : 'User Role cannot be Verified'
        })
    }
}