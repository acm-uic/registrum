import { AxiosInstance } from 'axios';
import { Request, Response } from 'express';
import User, { UserObject } from '../models/User';
import { BannerClient } from '../util/BannerClient';
import { notifyUser } from '../util/notifier';
import { isAuthenticated } from '../util/passport';
import { Controller } from './Controller';

export type BannerControllerConfig = {
  notifyUrl: string;
  bannerUrl: string;
};
export class BannerController extends Controller {
  #notifyUrl: string;
  #bannerUrl: string;
  #bannerClient: AxiosInstance;
  constructor(path: string, config: BannerControllerConfig) {
    super(path);
    this.#notifyUrl = config.notifyUrl;
    this.#bannerUrl = config.bannerUrl;
    this.#initializeRoutes();
    this.#bannerClient = new BannerClient(this.#bannerUrl).client;
  }

  #initializeRoutes = () => {
    this.router.post('/subscribe', isAuthenticated, async (req: Request, res: Response) => {
      // * Grab user id from session
      const _id = (req.user as UserObject)._id;

      // * Grab CRN from params
      const { crn } = req.body;

      if (crn) {
        // * Add subscription to class model (addToSet ensures unique CRN's, no duplicates)
        await User.updateOne({ _id }, { $addToSet: { subscriptions: crn } });
        console.log('SUBSCRIBING WITH ' + `${this.#notifyUrl}/notify/${_id}/${crn}`);
        // * Subscribe via Banner API
        try {
          // * Waiting for Banner Client to be completely implemented
          await this.#bannerClient.post('/hook/addHook', {
            url: `${this.#notifyUrl}/notify/${_id}/${crn}`,
            crn
          });
        } catch (err) {
          // ! DO NOTHING Since banner routes aren't implemented yet
          console.log(err.message);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).send('Subscription Successful');
      } else {
        res.status(400).send('No Class CRN provided');
      }
    });

    this.router.post('/unsubscribe', isAuthenticated, async (req: Request, res: Response) => {
      // * Grab user id from session
      const _id = (req.user as UserObject)._id;

      // * Grab CRN from params
      const { crn } = req.body;

      if (crn) {
        // * Remove Subscription from class model
        await User.updateOne({ _id }, { $pull: { subscriptions: crn } });

        // * Subscribe via Banner API
        try {
          console.log('UNSUBSCRIBING WITH ' + `${this.#notifyUrl}/notify/${_id}/${crn}`);
          // ! Waiting for Banner Client to be completely implemented
          await this.#bannerClient.post('/hook/deletehook', {
            url: `${this.#notifyUrl}/notify/${_id}/${crn}`,
            crn
          });
        } catch (err) {
          // * DO NOTHING Since banner routes aren't implemented yet
          res.status(500).send('Error trying to unsubscribe to class');
          return;
        }
        // TODO: Subscribe to CRN with banner API
        res.status(200).send('Unsubscription Successful');
      } else {
        res.status(400).send('No Class CRN provided');
      }
    });

    this.router.get('/tracking', isAuthenticated, async (req: Request, res: Response) => {
      // * Grab user id from session
      const _id = (req.user as UserObject)._id;

      // * Grab updated user
      const user = await User.findOne({ _id });

      if (user) {
        // * Serialize CRNs
        const crns: string[] = user.subscriptions;

        // * Grab class JSONs from banner API
        const { data: classes } = await this.#bannerClient.post('/course', {
          courseReferenceNumbers: crns
        });
        // * Send class JSONs
        res.send(classes);
      }
    });

    this.router.post('/notify/:id/:crn', async (req: Request, res: Response) => {
      // * Grab needed params off of request
      const { id: _id } = req.params;
      const courseDocument = req.body;

      try {
        // * Resolve updated user
        const user = await User.findOne({ _id });
        if (user) {
          console.log(user.email);
          // * Send user notification
          await notifyUser(user, courseDocument);

          // * Notification successful
          res.status(200).send('NOTIFICATION SUCCESSFUL');
        }
      } catch (err) {
        // ! Error notifying user
        res.status(400).send(err.message);
      }
    });
  };
}
