import passport from 'passport';
import Local from 'passport-local';
import User, { UserObject } from '../models/User';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

// * Setup serialization and De-serialization functions
passport.serializeUser((user: UserObject, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id });
    done(null, user);
  } catch (err) {}
});

// * Setup Passport Strategies
passport.use(
  new Local.Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      // * Check if user exists
      if (!user) {
        return done(null, false, { message: 'Invalid email or password!' });
      }

      // * Check if password is correct
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Invalid email or password!' });
      }

      // * Return user
      return done(null, user);
    } catch (err) {}
  })
);

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('Error, Not logged in');
  }
}
