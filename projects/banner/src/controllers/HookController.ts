import { WebHooks } from '@bmiddha/webhooks';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Controller } from 'registrum-common/dist/classes/Controller';
import { Course } from 'registrum-common/dist/lib/Banner';
import { CourseSchema } from 'registrum-common/dist/schemas/Banner';

export class HookController extends Controller {
  #webHooks: WebHooks;

  constructor(path: string) {
    super(path);
    this.#webHooks = new WebHooks({ mongooseConnection: mongoose.connection });
    this.#initializeRoutes();
    this.#initWatcher();
  }

  #initWatcher = () => {
    const CourseModel = mongoose.model<Course & mongoose.Document>('Course', CourseSchema);
    CourseModel.watch().on('change', (data: any) => {
      if (data && data.fullDocument && data.fullDocument.courseReferenceNumber) {
        console.log(`${data.fullDocument.courseReferenceNumber} updated`);
        this.#webHooks.trigger(data.fullDocument.courseReferenceNumber, data.fullDocument);
      }
    });
  };

  #initializeRoutes = () => {
    this.router.post('/addHook', this.#addHook);
    this.router.post('/deletehook', this.#deleteHook);
  };

  #addHook = async (request: Request, response: Response) => {
    const { crn, url } = request.body;
    console.log(crn);
    await this.#webHooks.add(crn, url);
    this.created(response);
  };

  #deleteHook = async (request: Request, response: Response) => {
    const { crn, url } = request.body;
    await this.#webHooks.remove(crn, url);
    this.ok(response);
  };
}
