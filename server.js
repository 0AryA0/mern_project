const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
//passport has many autication methods
const passport = require('passport');
//passport-jwt is just one of autinaction methods


//define routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

//make git m = "message"

//db config (database uri from keys)
const db = require('./config/keys').mongoURI;

app.use(bodyparser.json({type: '*/*'}));
app.use(bodyparser.urlencoded({ extended: true}));

//connect to mongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("mongoDB connected"))
.catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


//user routes
//app.use(express.json());
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
