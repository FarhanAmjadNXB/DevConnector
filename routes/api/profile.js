const express = require('express');
const router = express.Router();
const auth = require('../../middlewear/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@ route  GET api/profile/me
//@ description  This will give specific user profile
//@ access  PRIVATE

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    const user = await User.findById(req.user.id).select('-password');

    if (!profile) {
      res.status(400).json({ msg: 'Profile does not exist' });
    }

    profile.info = {};
    profile.info = { name: user.name, avatar: user.avatar };
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }

  // res.send('Profile route')
});
module.exports = router;

//@ route  POST api/profile
//@ description  This will post the user profile in database
//@ access  PRIVATE

const { check, validationResult } = require('express-validator');

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is a required field').not().isEmpty(),
      check('skills', 'Skills is a required field').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;

    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });

      const user = await User.findById(req.user.id).select('-password');
      if (profile) {
        //Update profile

        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        profile.info = {};
        profile.info = { name: user.name, avatar: user.avatar };

        return res.json(profile);
      }

      //Create Profile and save
      profile = new Profile(profileFields);

      await profile.save();
      profile.info = {};
      profile.info = { name: user.name, avatar: user.avatar };
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }

    // res.send('Profile route')
  }
);
module.exports = router;
