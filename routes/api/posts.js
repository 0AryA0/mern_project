const express = require('express');
const router = express.Router();


/*
    @route GET api/posts/test
    @desc Tests posts route
    @access Public

    but we need private routes

    we dont want anyone access post req 
    to create account or something
    
    so we need jsontoken
    a token will send with json objects...
*/

router.get('/test', (req, res) => res.json({message: "posts works"}));

module.exports = router;