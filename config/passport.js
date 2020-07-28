const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
//uses User schema
const User = mongoose.model('users');
const keys = require('../config/keys');
const passport = require('passport');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.key
};

module.exports = passport => {
    //we passed passport
    passport.use(new jwtStrategy(opts, (payload, done) => {
        //payload = users stuff that we created in users.js
        //find by id is a mongoose method that find user from its id
        User.findById(payload.id)
        .then(user => {
            if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }));
}