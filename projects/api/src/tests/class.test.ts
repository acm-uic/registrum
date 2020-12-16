import axios, { AxiosInstance } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { Server } from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { CookieJar } from 'tough-cookie';
import { App } from '../App';
import mockApp from './mockbanner';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

const mongoServer: MongoMemoryServer = new MongoMemoryServer();

describe('Class Tests', () => {
  const basePath = '/api';

  // * Initialize
  let port: number;
  let baseURL: string;
  let mongoUri: string;
  let expressApp: App;
  let server: Server;
  let client: AxiosInstance;
  let bannerServer: Server;
  let bannerPort: number;

  beforeAll(async () => {
    mongoUri = await mongoServer.getUri();
    // mongoUri = 'mongodb://localhost:27017/testing'

    // * Start listening on available port
    bannerServer = mockApp.listen(0, () => console.log('MOCK APP LISTENING'));
    // * Find banner port
    bannerPort = await new Promise(resolve => {
      bannerServer.on('listening', () => {
        const serverAddr = bannerServer.address();
        if (serverAddr) {
          const addressInfo = serverAddr.valueOf() as {
            address: string;
            family: string;
            port: number;
          };
          resolve(addressInfo.port);
        }
      });
    });

    // * Wait for app to initialize
    await new Promise<void>(resolve => {
      // * Create the app with the configurations
      expressApp = new App(
        {
          port,
          basePath,
          mongoUri,
          serviceName: 'API',
          bannerUrl: `http://localhost:${bannerPort}/banner`,
          apiHost: ''
        },
        resolve
      );
    });

    // * Start listening on available port
    server = expressApp.listen(0);

    // * Find app port
    port = await new Promise(resolve => {
      server.on('listening', () => {
        const serverAddr = server.address();
        if (serverAddr) {
          const addressInfo = serverAddr.valueOf() as {
            address: string;
            family: string;
            port: number;
          };
          resolve(addressInfo.port);
        }
      });
    });
    baseURL = `http://localhost:${port}${basePath}/`;

    // * Create axios client
    client = axios.create({
      withCredentials: true,
      baseURL,
      jar: new CookieJar(),
      validateStatus: () => {
        /* always resolve on any HTTP status */
        return true;
      }
    });
    axiosCookieJarSupport(client);

    const response = await client.post('/auth/signup', {
      firstname: 'John',
      lastname: 'Doe',
      email: 'registrum@example.com',
      password: 'theRealApp1$'
    });
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    // * Remove all users from DB
    await new Promise<void>(resolve => {
      mongoose.connection.db.dropCollection('users', () => {
        resolve();
      });
    });

    // * Close DB Connection
    await new Promise<void>(resolve => {
      mongoose.connection.close(() => {
        resolve();
      });
    });

    // * We wait until all threads have been run once to ensure the connection closes.
    await new Promise<void>(resolve => setImmediate(resolve));

    // * Close Server
    server.close();
    await mongoose.disconnect();
    mongoServer.stop();
    bannerServer.close();
  });

  describe('Sanity tests', () => {
    it('Returns a valid list of terms', async () => {
      // * Grab terms
      const { data: terms } = await client.get('/classes/terms');

      // * Assure each term is valid by checking it is a number
      terms.forEach((term: string) => {
        expect(() => parseInt(term)).not.toThrow();
      });
    });

    it('Returns a valid list of subjects for a retrieved term', async () => {
      // * Grab subjects for given term
      const { data: subjects } = await client.get(`/classes/subjects`);

      // * Make sure each subject is a valid string
      subjects.forEach((subject: string) => {
        expect(typeof subject === typeof String);
      });
    });

    it('Returns a valid list of courses for a given subject', async () => {
      // * Grab subjects for given term
      const { data: subjects } = await client.get(`/classes/subjects`);
      console.log(subjects);
      // * Grab classes for given subject
      const { data: classes } = await client.get(`/classes/list/220208/${subjects[0]}`);
      console.log(classes);
      // * Make sure each class is a valid class object
      classes.forEach((cls: string) => {
        expect(typeof cls === typeof String);
      });
    });
  });

  describe('Edge case tests', () => {
    it('Returns an empty array of classes for an invalid subject', async () => {
      // * Try to retrieve classes
      const { data: classes } = await client.get('/classes/list/220208/invalidSubjectHere');
      expect(classes).toHaveLength(0);
    });
  });

  // ! Could not find proper way to mock api requests in testing in time
  // describe('CRN Tests', () => {
  //     // it('Can query by CRN', () => {
  //     //     test.todo
  //     // })
  //     // it('Invalid CRN yields empty query', () => {
  //     //     test.todo
  //     // })
  // })
});
