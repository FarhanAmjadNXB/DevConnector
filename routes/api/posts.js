const express = require('express');
const router = express.Router();


//@ route  GET api/auth

//@ description  This will give specific user authectiocation token

//@ access  PUBLIC

router.get('/', (req, res) => res.send('Posts route'));
module.exports = router;