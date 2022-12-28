# Dashboard Artist API

## Description

This backend is power by [Nest](https://github.com/nestjs/nest) framework.

### Information Important

1. [Project structure](#projectstructure)
2. [Config-and-enviroments](#config-and-enviroments)
3. [GCP-credentials](#gcp-credentials)
4. [runing-app](#runing-app)
5. [dockerized](#dockerized)
6. [linter](#linter)
7. [unit-test](#unit-test)
8. [test-coverage](#test-coverage)

### Project Structure

<a name="projectstructure"/>

The structure of this project defined by folders with specific purpose.

each module is composed by Repository, dto, interfaces, controler, service, module and schemas and entities (if is necesary)

```
.
├── auth-connection-bigquery.json
├── coverage
├── datastore-permission.json
├── dist
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── artist
│   │   ├── dto
│   │   ├── repository
│   │   ├── interfaces
│   │   ├── service
│   │   ├── controller
│   │   ├── module
│   ├── auth
│   │   ├── dto
│   │   ├── repository
│   │   ├── interfaces
│   │   ├── service
│   │   ├── controller
│   │   ├── module
│   ├── bigquery
│   │   ├── dto
│   │   ├── repository
│   │   ├── interfaces
│   │   ├── service
│   │   ├── controller
│   │   ├── module
│   ├── config
│   │   ├── env
│   │   │   ├── sample.enviroment.env
│   ├── main.ts
│   ├── middlewares
│   └── users
│   │   ├── dto
│   │   ├── repository
│   │   ├── interfaces
│   │   ├── service
│   │   ├── controller
│   │   ├── module
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

### Config-and-enviroments

<a name="config-and-enviroments"/>

you need to at least one .env files acoording to the enviroments. you can create file follow this format name `.env.<enviromentName>.local`. this API supports 3 enviroments files (.env.development.local, .env.test.local and .env.production.local). You have a sample.enviroment.env config and looks in this way

```
NODE_ENV=development

PORT=4000

JWT_SECRET=secretSeed
JWT_EXPIRES_IN=8h

# PRO TIP Remenber use service name from mongo into docker compose file (you must use the same)
# (should be mongodb://mongo:27017/db_dev)
MONGO_URI=mongodb://localhost:27017/db_dev

# TTL in segs, start 1 hour
NEST_TTL_CACHE=3600
NEST_MAX_CACHE_STORAGE=1000

# GCP Vars
PROJECT_ID=gcpProjectId
```

IMPORTANT: you should create this .env files in this path `src/config/env`

### GCP-credentials

<a name="gcp-credentials"/>

you should have at least one credentials files to connect an consume GCP platform, at the same level of SRC. This specific scenario you have two files configuration and you should rename this follow for bigQuery connection based ib `auth-connection-bigquery.json` abd datastore conection `datastore-permission.json`.

if you have just one file remenber to update path for those json files in `big-query-adapter.repository.ts`. You must see the following methods `connectWithBigquery` and `connectWithDatastorage`

### Runing-app

<a name="runing-app"/>

```bash
# dependencies
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Dockerized

<a name="dockerized"/>

You can start the project at local but also you can do it via docker compose. you should have installed docker, and docker compose.

for running the app using docker you can write on your terminal

```bash
# dockerized development
$ docker compose up dev

# dockerized production
$ docker compose up prod
```

## Linter

<a name="linter"/>

this project have linter ready to use

```bash

$ npm run lint
```

## Tests

<a name="unit-test"/>

if you want to running unit test and e2e/functional test around the app, you can execute those commands

```bash
# unit tests
$ npm run test

# e2e tests/Functional Tests
$ npm run test:e2e
```

## Test coverage

<a name="test-coverage"/>

if you want to running coverage script, you can execute those commands

```bash
# test coverage
$ npm run test:cov
```
