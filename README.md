# Dream Team Final Project

[![Node CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Node%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Node+CI%22)
[![Docker CI](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CI/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CI%22)
[![Docker CD](https://github.com/ckanich-classrooms/final-project-dream-team-1/workflows/Docker%20CD/badge.svg)](https://github.com/ckanich-classrooms/final-project-dream-team-1/actions?query=workflow%3A%22Docker+CD%22)
[![codecov](https://codecov.io/gh/ckanich-classrooms/final-project-dream-team-1/branch/master/graph/badge.svg?token=5aYe8JnyLU)](https://codecov.io/gh/ckanich-classrooms/final-project-dream-team-1)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

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
    - [Deliverables for final project](#deliverables-for-final-project)
  - [CI/CD](#cicd)
    - [Node CI](#node-ci)
    - [Docker CI](#docker-ci)
    - [Docker CD](#docker-cd)
  - [Docker](#docker)
    - [Production Deployment](#production-deployment)
    - [Rush](#rush)
    - [Developing with Docker](#developing-with-docker)
    - [Prerequisites](#prerequisites)
    - [Getting the development container images](#getting-the-development-container-images)
    - [Running the development containers](#running-the-development-containers)
    - [Using commands in the containers](#using-commands-in-the-containers)
    - [Other common commands](#other-common-commands)
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

### Deliverables for final project

The full application will be completed with an API, Microservice Infrastructure and React/Typescript client and a defined
production workflow.

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
- Run `docker-compose -f docker-compose.prod.yml up`.

The docker containers expose the following services:

| ------------ | ----- | ----------------------------------------------- |
| Nginx        | 8080  | Servers static files and proxies other services |

### Rush

This monorepo uses rush <https://github.com/microsoft/rushstack/>.

**DO NOT COMMIT `package-lock.json` FILES.**

The shrinkwrap file is global to the monorepo located in `common/config/shrinkwrap.yml`

Common clone workflow:

```powershell
git clone repo.git
cd repo
rush update # Similar to npm install, install and link dependencies
rush build # Build all projects
```

### Developing with Docker

### Prerequisites

- Install Docker <https://docs.docker.com/install/>.
- Install Docker Compose <https://docs.docker.com/compose/install/>.

### Getting the development container images

```powershell
# Login in to GitHub Package Registry (required for pulling containers)
docker login docker.pkg.github.com --username <github_username>

# Pull prebuilt development containers from GitHub Package Registry (not required if using build)
docker-compose pull

# Build the development containers (not required if using pull)
docker-compose build --pull --no-cache
# Builds can be sped up by using --parallel (can be slower if less resources are allocated to Docker)
docker-compose build --pull --no-cache --parallel
```

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
docker-compose exec app-dev bash
```

### Other common commands

```powershell
# Restart service
docker-compose restart api
```

The docker dev containers expose the following services:

| Service Name        | Ports            | Description                             |
| ------------------- | ---------------- | --------------------------------------- |
| Registrum Node Apps | 3000, 4000, 4001 | Node.js apps (client, api, banner, ...) |
| Mongo Express       | 8081             | MongoDB Web Client                      |
| Redis Commander     | 8082             | Redis Web Client                        |

## Sources

Client Skeleton cloned from <https://github.com/alexchomiak/goto-react-app-2.0>

Server Skeleton cloned from <https://github.com/microsoft/TypeScript-Node-Starter>
