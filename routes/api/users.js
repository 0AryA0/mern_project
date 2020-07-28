const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
//specify in certain row
const passport = require('passport');
const jwt = require('jsonwebtoken');

//load register validator

const registerValidtor = require('../../validator/register');

//load user model
const User = require('../../models/User');
const { route } = require('./profile');

/*
    @route GET api/users/register
    @desc register user
    @access Public
*/

router.post('/register', (req, res) => {

    //check for valid inputs
    const {errors, isValid} = registerValidtor(req.body);
    if(!isValid) {
        console.log('error');
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    console.log(email);
    //check if email is available
    User.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if (result != null) {
                console.log('email address is ' + email);
                return res.status(400).json({ email: 'email already exists' });
            }
            else {
                console.log("adding a new user");
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default
                });

                //create user

                let user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;

                        user.password = hash;
                        user.save((err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("user added successfully");
                                return res.status(200).json({ status: 'user registered successfully' });
                            }
                        });
                    });
                });
            }
        }
    });
});

/*
@route GET api/users/login
@desc login user
@access Public
*/

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                //if email does not exists
                return res.status(400).json({ email: 'user not found' });
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    //if user exists and password is correct
                    const payload = { id: user.id, name: user.name, avatar: user.avatar } // create jwt payload

                    //jwt stands for javascript web token
                    jwt.sign(payload, keys.key, { expiresIn: 3600 }, (err, token) => {
                        res.json({ success: true, token: 'Bearer ' + token});
                    });
                }
                else {
                    //if password is incorrect
                    return res.status(200).json({ password: 'incorrect' });
                }
            })
        })
});

/*
    @route GET api/users/current
    @desc return current user
    @access private
*/

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({msg: 'success'});
});

module.exports = router;
