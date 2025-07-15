export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in.' });
}

export function ensureAdmin(req, res, next) {
     console.log('Session:', req.session);
    console.log('Is Authenticated:', req.isAuthenticated());
    console.log('Logged-in user:', req.user);
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admins only.' });
}

export function ensureCounselor(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'counselor') {
    return next();
  }
  res.status(403).json({ message: 'Counselors only.' });
}
