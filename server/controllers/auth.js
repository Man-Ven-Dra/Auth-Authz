const user = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { options } = require('../routes/userRoutes');
require('dotenv').config()

exports.signup = async(req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const existingUser = await user.findOne({ email })
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message: 'User Already Registerd'
            })
        }
        
        let hashedPwd;
        try {
            hashedPwd = await bcrypt.hash(password, 10)
        } 
        catch(err) {
            res.status(400).json({
                success:false,
                message: 'Error in hashing'
            })
        }

        const newUser = await user.create({
            name,
            email,
            role,
            password: hashedPwd,
        })

        res.status(200).json({
            success: true,
            data: newUser,
            message: 'Account Created Successfully'
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            data: err,
            message: 'Account Creation Failed'
        })
    }
}

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if( !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Enter both Email & Password'
            })
        }

        let registered = await user.findOne({ email })
        if( !registered ) {
            return res.status(401).json({
                success: false,
                message: 'User not Signed in'
            })
        }

        const payload = {
            email: registered.email,
            id: registered._id,
            role: registered.role,
        }
        if(await bcrypt.compare(password, registered.password)) {
            let token = jwt.sign(payload, process.env.JWT, {
                                    expiresIn: '2h'
                                });
            registered = registered.toObject();
            registered.token = token;
            registered.password = undefined;
            
            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie('token', token, options).status(200).json({
                success:true,
                token,
                registered,
                message: 'User Logged In.'
            })
        } else {
            return res.status(403).json({
                success: false,
                message: 'Incorrect Password'
            })
        }
    }   
    catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Failure'
        })
    }
}