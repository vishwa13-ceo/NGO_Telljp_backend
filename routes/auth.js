import express from 'express';
import passport from 'passport';
import { register, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);

// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.json({ message: 'Logged in', user: req.user });
// });*/ 

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log('Login attempt:', {
      error: err,
      user: user,
      info: info
    });
    
    if (err) { return next(err); }
    if (!user) { return res.status(401).json(info); }
    
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({ user });
    });
  })(req, res, next);
});

router.get('/logout', logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // or frontend URL
  });

export default router;
