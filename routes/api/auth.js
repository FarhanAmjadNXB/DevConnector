const express = require('express');
const router = express.Router();
const auth = require('../../middlewear/auth');
const { use } = require('./posts');

//@ route  GET api/auth
//@ description  This will give specific user authectiocation token

//@ access  PRIVATE

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.messsage);
    res.status(500).send('Server Error');
  }
  // res.send('Auth route')
});
module.exports = router;
