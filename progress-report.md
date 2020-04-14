## What were the different functionalities you aimed to finish for each deadline (checkpoints 2, 3, 4)?

- A quick English description of “what is currently working in the app”
  - Users are able to sign up and track classes, can update account information,and app can be configured to send email notifications to user on class data changes
- Who accomplished what
  - Alex and Bharat coordinated the connection of the Banner API Microservice, Project API, and React Client which led to seamless integration to create one cohesive app ontop of a robust microservice infrastructure.
  - Arshad, Jigar and Clark are worked on setting up the PWA manifest.
  - Bharat and Arshad setup rush for mono repo management
- What didn’t get done in time
  - Client PWA / Text notifications with Twilio
  - Some of the API tests testing integration between the microservice layer and the banner api, this is because we could not find a way to efficiently mock requests inbetween microservices. More test will be written on this front if we find an efficient manner to do this.

## What is the plan of attack for finishing Checkpoint 5?
- What functionality remains to be finished
  - Client PWA Working with   - Jigar / Arshad / Clark
  - Add more notifications options, kubernetes(tenative) - Alex
  - Selective sync of watched classes - Bharat

- What changes, if any, do you want to make from your original plan?
  - Text to email notifications for the time being
- What is your reason for making those changes (i.e. what you did try, what you learned, what you realized is way harder than it needed to be, and how you realized that)?
  - PWAs do not work at all on IOS
  - Need an alternatives for PWA notifications & email is a good approach


