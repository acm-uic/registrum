# Dream Team Final Project

[![Node CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Node%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Node+CI%22)
[![Docker CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CI%22)
[![Docker CD - Master](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CD%20-%20Master/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CD+-+Master%22)
[![Docker CD - Release](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CD%20-%20Release/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CD+-+Release%22)
[![codecov](https://codecov.io/gh/ckanich-classrooms/final-project-dream-team-1/branch/master/graph/badge.svg?token=5aYe8JnyLU)](https://codecov.io/gh/ckanich-classrooms/final-project-dream-team-1)

## Table of Contents

- [Dream Team Final Project](#dream-team-final-project)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Authors, Specialization](#authors-specialization)
  - [Checkpoints](#checkpoints)
    - [Questions for checkpoint 1](#questions-for-checkpoint-1)
    - [Deliverables for checkpoint 2](#deliverables-for-checkpoint-2)
    - [Tests for checkpoint 4 (checkpoint 3 deliverable)](#tests-for-checkpoint-4-checkpoint-3-deliverable)
    - [Deliverables for checkpoint 4](#deliverables-for-checkpoint-4)
    - [Checkpoint 4 write up](#checkpoint-4-write-up)
      - [Final Submission Tests Goals](#final-submission-tests-goals)
    - [Progress Report](#progress-report)
    - [Deliverables for final project](#deliverables-for-final-project)
  - [CI/CD](#cicd)
    - [Node CI](#node-ci)
    - [Docker CI](#docker-ci)
    - [Docker CD](#docker-cd)
  - [Rush](#rush)
  - [Docker](#docker)
    - [Production Deployment](#production-deployment)
    - [Developing with Docker](#developing-with-docker)
    - [Prerequisites](#prerequisites)
    - [Running the development containers](#running-the-development-containers)
    - [Using commands in the containers](#using-commands-in-the-containers)
    - [Other common commands](#other-common-commands)
  - [Getting a development environment up](#getting-a-development-environment-up)
    - [Seeding banner api data (optional)](#seeding-banner-api-data-optional)
    - [NOTES](#notes)
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

### Tests for checkpoint 4 (checkpoint 3 deliverable)

Tests to be written in Microservice API ( written as todo in test file )

- Cannot subscribe to class with invalid CRN
- Cannot unsubscribe to class with invalid CRN
- Banner API returns all proper class information upon query
- Correct subjects are retrieved for FALL 2020
- Correct CS 141 Listings are retrieved for CS In FALL 2020

### Deliverables for checkpoint 4

Basic microservice functionality, client completion (tenative), completed API(tenative).

### Checkpoint 4 write up

#### Final Submission Tests Goals
More Client Tests
  * Client correctly renders ClassListing Component
  * Break up
Finish API Tests
  * Add more tests for class data
      * Query by CRN
      * Querying by invalid CRN yields invalid result
(We will add much more tests if we find a way to more properly mock api requests between microservices)

### Progress Report
The progress report is located in the progress-report.md file in the root of the directory which can be accessed [here](progress-report.md)


### Deliverables for final project

The full application will be completed with **an** API, Microservice Infrastructure and React/Typescript client and a defined production workflow.


You can also run `./init.sh` which runs `rush update`, `build`, and `watch`

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

## Rush

This monorepo uses rush <https://github.com/microsoft/rushstack/>.

**DO NOT COMMIT `package-lock.json` FILES.**

The shrinkwrap file is global to the monorepo located in `common/config/pnpm-lock.yaml`

Common clone workflow:

```powershell
npm i -g @microsoft/rush
git clone repo.git
cd repo
rush update # Similar to npm install, install and link dependencies
rush build # Build all projects
```

## Docker

### Production Deployment

- Install Docker <https://docs.docker.com/install/>.
- Install Docker Compose <https://docs.docker.com/compose/install/>.
- Run `docker-compose -f docker-compose.prod.yml up`.

The docker containers expose the following services:

| ------------ | ----- | ----------------------------------------------- |
| Nginx        | 8080  | Servers static files and proxies other services |

### Developing with Docker

### Prerequisites

- Install Docker <https://docs.docker.com/install/>.
- Install Docker Compose <https://docs.docker.com/compose/install/>.

### Running the development containers

```powershell
# Create the services defined in docker-compose.yml
docker-compose up -d
# Follow logs
docker-compose logs -f
# Check running service status
docker-compose ps
# Stop services
docker-compose down
```

### Using commands in the containers

```powershell
# Running commands inside the container
# Run a shell inside a container.
# Dev Containers are built with Debian base image which include bash among other utilities.
# They are not available in production containers as they are built with alpine.
docker-compose exec mongo bash
```

### Other common commands

```powershell
# Restart service
docker-compose restart mongo
```

The docker dev containers expose the following services:

| Service Name    | Ports | Description                                |
| --------------- | ----- | ------------------------------------------ |
| MongoDB Server  | 27017 | MongoDB server needed by the API           |
| Redis Server    | 6379  | Redis server needed by the API             |
| Redis Server    | 6380  | Redis server needed by the Banner Services |
| Mongo Express   | 8081  | MongoDB Web Client                         |
| Redis Commander | 8082  | Redis Web Client                           |

## Getting a development environment up

1. First make sure Microsoft's rush is installed, then clone the repo and setup rush by executing these commands in order
```powershell
npm i -g @microsoft/rush

git clone git@github.com:ckanich-classrooms/final-project-dream-team-1.git

rush update # install and link dependencies, add git hooks
rush build # build all projects
rush watch # build, watch, and run all projects
```

2. Start up docker-compose to make sure your services are available before starting up the application
```powershell
     docker-compose up # spin up the required services (MongoDB, Redis)
```
3. Now run this command to start up the app

```powershell
rush watch # build, watch, and run all projects
```

### Seeding banner api data (optional)
The client may not work as expected because the database is not supplied the banner database data to begin with. You can build the banner-data service and run it to populate the needed data. Here are the commands you might need:
```powershell
cd banner-data # change into the banner-data project
npm run build # build the project
cd dist # change into the built project
node index.js --now # * This tool will populate the needed data for the banner API to function as expected

# MAKE SURE you have docker compose running during this entire process
```
This will seed data from only CS courses in the most recent term to prevent making too many requests to Banner in development. The app will have access to all classes in production.

### NOTES
* When running tests locally, make sure docker-compose is up and running so the app has access to the necessary services. Otherwise the tests will not pass!
* Run said tests with the following command:
  ```powershell
    rush test
  ```
## Sources

Client Skeleton cloned from <https://github.com/alexchomiak/goto-react-app-2.0>

Server Skeleton cloned from <https://github.com/microsoft/TypeScript-Node-Starter>
