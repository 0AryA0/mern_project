const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//load user model
const User = require('../../models/User');

/*
    @route GET api/users/test
    @desc Tests users route
    @access Public
*/

router.get('/test', (req, res) => res.json({ message: "users works" }));

/*
    @route GET api/users/register
    @desc register user
    @access Public
*/

router.post('/register', (req, res) => {

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
                        if(err) throw err;
            
                        user.password = hash;
                        user.save((err, result) => {
                            if(err) {
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



    //generate a salt with bcrypt and hash the password


    
    
    



});

module.exports = router;
