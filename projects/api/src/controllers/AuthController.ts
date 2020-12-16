import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import passport from 'passport';
import User, { UserObject } from '../models/User';
// * Bind Passport strategies
import '../util/passport';
import { isAuthenticated } from '../util/passport';
import { Controller } from './Controller';

export class AuthController extends Controller {
  constructor(path: string) {
    super(path);
    this.#initializeRoutes();
  }

  // * Remove data shouldn't be sent to client
  static stripData(data: UserObject) {
    const result = JSON.parse(JSON.stringify(data));
    delete result['password'];
    return result;
  }

  // * RegExp verifies that the name don't have outlandish characters
  static nameRegex = RegExp(/[a-zA-Z]+[a-zA-Z-\s]+[a-zA-Z]*$/);

  // * RegExp verifies that the email matches according to W3C standard
  static emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

  // * RegExp verifies that the password is adhering to our standard
  // * Length is at least 8
  // * Has one lower case and upper case English letter
  // * Has one digit and one special character
  static passwordRegex = RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

  #initializeRoutes = () => {
    // * All routes under /auth/*
    this.router.get('/', isAuthenticated, async (req: Request, res: Response) => {
      const user = await User.findOne({ _id: (req.user as UserObject)._id });
      if (user) res.status(200).json(AuthController.stripData(user));
    });
    /* Login by passport.authenticate */
    this.router.post(
      '/login',
      passport.authenticate('local', { failureFlash: false }),
      async (req: Request, res: Response) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) res.status(200).json(AuthController.stripData(user));
      }
    );

    /* Logout Route: Validation handled by passport */
    this.router.get('/logout', isAuthenticated, (req: Request, res: Response) => {
      req.logout();
      res.send('OK');
    });

    // * Registration route
    this.router.post('/signup', async (req: Request, res: Response) => {
      // * Grab needed elements from request body
      const { firstname, lastname, email, password } = req.body;

      // * Verify that the first and last name is valid
      if (!AuthController.nameRegex.test(firstname) || !AuthController.nameRegex.test(lastname)) {
        res.status(400).send('Name is invalid');
        return;
      }

      // * Verify that the email matches according to W3C standard
      if (!AuthController.emailRegex.test(email)) {
        res.status(400).send('Email is invalid');
        return;
      }

      // * Verify the the password is adhering to out standard
      // * Length is at least than 8
      // * Has one lower case and upper case English letter
      // * Has one digit and one special character
      if (!AuthController.passwordRegex.test(password)) {
        res.status(400).send('Password is not strong enough');
        return;
      }

      // * Check if user already exists
      const test = await User.findOne({ email });
      if (test) {
        res.status(400).send('Email already exists!');
        return;
      }

      // * Setup User
      const user = new User({
        firstname,
        lastname,
        email,
        // * Hashed Password
        password: await bcrypt.hash(password, 2)
      });

      // * Save user
      await user.save();

      // * Login User
      req.login(user, () => {
        /* Return user data is successfully signup */
        res.status(200).json(AuthController.stripData(user));
      });
    });

    this.router.post('/update', isAuthenticated, async (req: Request, res: Response) => {
      // * Get the user object
      const user = req.user as UserObject;

      // * Grab password out of body
      const { userPassword } = req.body;

      // * If password is not provided, send error status
      if (!userPassword) {
        res.status(401).send('Password not provided');
        return;
      }

      // * Grab up to date user from database
      const userDatabaseEntry = await User.findOne({ _id: user._id });

      // * Make sure provided password is correct
      if (!(userDatabaseEntry && (await bcrypt.compare(userPassword, userDatabaseEntry.password)))) {
        res.status(401).send('Password not valid');
        return;
      }

      // * Grab updates from body
      const updates = req.body;

      try {
        // requestBody check (Prevent changing prohibited column)
        if (updates._id || updates.subscriptions) {
          res.status(400).send('Info update input violation');
          return;
        }

        // * If password is provided, hash said password
        if (updates.password) {
          // * Verify the the password is adhering to out standard
          // * Length is at least than 8
          // * Has one lower case and upper case English letter
          // * Has one digit and one special character
          if (!AuthController.passwordRegex.test(updates.password)) {
            res.status(400).send('Password is not strong enough');
            return;
          }
          updates.password = await bcrypt.hash(updates.password, 2);
        }

        if (updates.lastname) {
          // * Verify that the first and last name is valid
          if (!AuthController.nameRegex.test(updates.lastname)) {
            res.status(400).send('Last name is invalid');
            return;
          }
        }
        if (updates.firstname) {
          // * Verify that the first and last name is valid
          if (!AuthController.nameRegex.test(updates.firstname)) {
            res.status(400).send('First name is invalid');
            return;
          }
        }
        if (updates.email) {
          // * Verify that the email matches according to W3C standard
          if (!AuthController.emailRegex.test(updates.email)) {
            res.status(400).send('Email is invalid');
            return;
          }
        }

        // * Update in mongoose
        let updatedUser: any = await User.findOneAndUpdate({ _id: user._id }, updates, {
          new: true
        });

        // * Delete unnecessary keys
        updatedUser = JSON.parse(JSON.stringify(updatedUser));
        delete updatedUser['_id'];
        delete updatedUser['password'];
        delete updatedUser['__v'];

        // * Makes sure unnecessary keys/values are not sent
        res.status(200).send(updatedUser);
      } catch (err) {
        res.status(500).send('Error');
      }
    });
  };
}
