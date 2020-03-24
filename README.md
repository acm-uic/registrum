# Dream Team Final Project

[![Node CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Node%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Node+CI%22) [![Docker CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CI%22) [![Docker CD](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CD/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CD%22)

## Table of Contents

- [Dream Team Final Project](#dream-team-final-project)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Authors, Specialization](#authors-specialization)
  - [Checkpoints](#checkpoints)
    - [Questions for checkpoint 1](#questions-for-checkpoint-1)
    - [Deliverables for checkpoint 2](#deliverables-for-checkpoint-2)
    - [Deliverables for checkpoint 4](#deliverables-for-checkpoint-4)
    - [Deliverables for final project](#deliverables-for-final-project)
  - [CI/CD](#cicd)
    - [Node CI](#node-ci)
    - [Docker CI](#docker-ci)
    - [Docker CD](#docker-cd)
  - [Docker](#docker)
    - [Production Deployment](#production-deployment)
    - [Developing with Docker](#developing-with-docker)
  - [Sources](#sources)

## Description

The application will allow users to subscribe and receive notifications from classes at UIC based on when the class opens/closes. It is very similar in function to the Coursicle/Seatcheck applications that students have used in the past to keep an eye on classes they want to get into.

- Push notifications from PWA (Android for now)
- Application will be written in typescript

## Authors, Specialization

| Member           | Web dev level                          | Specialization  |
| ---------------- | -------------------------------------- | --------------- |
| Arshad Narmawala | Done a couple projects in React        | Mobile, Devops  |
| Alex Chomiak     | Fullstack engineer at a startup        | Devops, Cloud   |
| Jigar Patel      | Done full stack projects w/ node & vue | Frontend, Cloud |
| Clark Chen       | Novice now, expert next week           | Mobile,Security |
| Bharat Middha    | Done a couple projects in React        | Devops, Cloud   |

## Checkpoints

### Questions for checkpoint 1

Test Cases are written in tests file within api
Test Cases are as follows for now:

- Authentication Tests
  - Logs user incorrectly using email, password
  - Logs user out correctly
  - Cannot log in with incorrect email
  - Cannot login with an incorrect password
  - Error with status code 401 when attempting to log out when not logged in
  - Can't log in when already logged in, error thrown
- Class Tests
  - Correctly add class to user watch list
  - Correctly remove class from user watch list
  - Correctly retrieves list of class subjects from Banner DB
  - Correctly retrieves classes for given subject

Security Evaluation

- What things would an attacker potentially want to do using our app that we wouldn't want them to do?
  - Making too many API requests
    - Possibly implement API rate limiting
    - API Response Caching
  - XSS Attacks through username & password fields
    - Session hijacking
    - Unauthorized page access
    - CSRF - Cross-Site Request Forgery
    - Attacks to query class microservice (Manipulating API to instruct microservices to spam requests to Banner)
- What best practices will we follow security wise for this assignment?
  - How will we accomplish them?
    - Implement security rules on db side to prevent unauthorized http calls
    - Add user authentication
    - Use a front end framework that escapes characters for XSS

### Deliverables for checkpoint 2

We will have basic CRUD functionality ready by allowing for user login/registration. And some form of user profile manipulation

### Deliverables for checkpoint 4

Basic microservice functionality, client completion, completed API.

### Deliverables for final project

The full application will be completed with an API, Microservice and React/Typescript client

## CI/CD

This project uses GitHub Actions to automate build and release pipelines.

### Node CI

Triggers: `push`, `pull_request`

- Starts MongoDB and Redis services in Docker.
- Run `npm install`, `npm run test`, and `npm run build` on the Node.js projects.

### Docker CI

Triggers: `push`, `pull_request`

- Build containers defined in `docker-compose.yml` and `docker-compose.dev.yml`.
- If running on `master`, then publish the containers tagged as `master` and `dev` respectively to GitHub Package Registry.

### Docker CD

Triggers: `release`

Build containers, tag them with the release version, and publish them to GitHub Package Registry.

## Docker

### Production Deployment

- Install Docker <https://docs.docker.com/install/>.
- Install Docker Compose <https://docs.docker.com/compose/install/>.
- Run `docker-compose up`.

### Developing with Docker

- Install Docker <https://docs.docker.com/install/>.
- Install Docker Compose <https://docs.docker.com/compose/install/>.
- Run `docker-compose -f docker-compose.dev.yml build --pull --parallel --no-cache` to build the development containers or run `docker-compose -f docker-compose.dev.yml pull` to download them from GitHub Package Registry (running the pull requires the user to be logged in with `docker login docker.pkg.github.com --username <github_username>`, then typing their password / personal access token).
- Run `docker-compose -f docker-compose.dev.yml up -d`.

The docker dev containers expose the following services:

| Service Name     | Ports | Description                      |
| ---------------- | ----- | -------------------------------- |
| Registrum Client | 3000  | React App in /client             |
| Registrum API    | 4000  | Node.js API in /api              |
| MongoDB Server   | 27017 | MongoDB server needed by the API |
| Redis Server     | 6379  | Redis server needed by the API   |
| Mongo Express    | 8081  | MongoDB Web Client               |
| Redis Commander  | 8082  | Redis Web Client                 |

## Sources

Client Skeleton cloned from <https://github.com/alexchomiak/goto-react-app-2.0>

Server Skeleton cloned from <https://github.com/microsoft/TypeScript-Node-Starter>
