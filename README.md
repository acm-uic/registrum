# Registrum

[![Node CI](https://github.com/acm-uic/registrum/workflows/Node%20CI/badge.svg)](https://github.com/acm-uic/registrum/actions?query=workflow%3A%22Node+CI%22)
[![Docker CI](https://github.com/acm-uic/registrum/workflows/Docker%20CI/badge.svg)](https://github.com/acm-uic/registrum/actions?query=workflow%3A%22Docker+CI%22)
[![Docker CD - Master](https://github.com/acm-uic/registrum/workflows/Docker%20CD%20-%20Master/badge.svg)](https://github.com/acm-uic/registrum/actions?query=workflow%3A%22Docker+CD+-+Master%22)
[![Docker CD - Branch](https://github.com/acm-uic/registrum/workflows/Docker%20CD%20-%20Branch/badge.svg)](https://github.com/acm-uic/registrum/actions?query=workflow%3A%22Docker+CD+-+Branch%22)
[![codecov](https://codecov.io/gh/acm-uic/registrum/branch/master/graph/badge.svg?token=5aYe8JnyLU)](https://codecov.io/gh/acm-uic/registrum)

## Table of Contents

- [Registrum](#registrum)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
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

## Description

The application will allow users to subscribe and receive notifications from classes at UIC based on when the class opens/closes. It is very similar in function to the Coursicle/Seatcheck applications that students have used in the past to keep an eye on classes they want to get into.

- Push notifications from PWA (Android for now)
- Application will be written in typescript

## CI/CD

This project uses GitHub Actions to automate build and release pipelines.

### Node CI

Triggers: `push`, `pull_request`

- Starts MongoDB service in Docker.
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

| Service Name | Ports | Description                                     |
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
| Mongo Express   | 8081  | MongoDB Web Client                         |

## Getting a development environment up

- First make sure Microsoft's rush is installed, then clone the repo and setup rush by executing these commands in order

```powershell
npm i -g @microsoft/rush

git clone git@github.com:acm-uic/registrum.git

rush update # install and link dependencies, add git hooks
rush build # build all projects
```

- Start up docker-compose to make sure your services are available before starting up the application

```powershell
     docker-compose up # spin up the required services (MongoDB)
```

- Now run this command to start up the app

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

- When running tests locally, make sure docker-compose is up and running so the app has access to the necessary services. Otherwise the tests will not pass!
- Run said tests with the following command:

```powershell
  rush test
```
