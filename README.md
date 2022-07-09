<div align="center">

[![npm-image]][npm-url] <img alt="npm" src="https://img.shields.io/npm/dm/create-sojeb-express-ts-app?style=for-the-badge"> ![][typescript-image] [![synk-image]][synk-url]
[![GitHub issues](https://img.shields.io/github/issues/SojebSikder/create-sojeb-express-ts-app?style=for-the-badge)](https://github.com/SojebSikder/create-sojeb-express-ts-app/issues)

</div>

<br />

# create-sojeb-express-ts-app

Boilerplate to create a new express typescript project

## Example :

https://github.com/SojebSikder/nodejs-ecommerce

## Creating a new app

Using yarn :

```
yarn create sojeb-express-ts-app hello-world
```

## Configure

- Set up database credentials in env file
- run this command for database migration:
  `npx prisma db push`
- Migrate database using this command:
  `npx prisma migrate dev`

## Using cli to automate process

- generate controller and service together `yarn cmd make:module Blog`
- generate only controller `yarn cmd make:controller Blog`
- generate only service `yarn cmd make:service Blog`

## Installing

```
yarn install
```

# Production

## Build

```
yarn build
```

## Running

```
yarn start:prod
```

## Development

### Running

```
yarn start
```

### Watch changes

```
yarn start:dev
```

Or Install nodemon globally

```
yarn global add nodemon
```

Then run using this

```
nodemon app.ts
```

## Technology used

- Typescript
- Nodejs
- Express
- Prisma
- Mysql
- redis
- Nodemailer
- Jest
- jwt
- graphql etc.

# Contribute

---

If you want to contribute fork the repo, create new branch and make pull request.

## Setup (Contributing)

If you clone this repo then you have to setup these things manually.

- Copy .env.example to .env And set up database credentials in env file
- run this command for database migration:
  `npx prisma db push`
- Migrate database using this command:
  `npx prisma migrate dev`

## For help and support

Email: sojebsikder@gmail.com

## Issue

If you find any problem please create an issue.

[npm-image]: https://img.shields.io/npm/v/create-sojeb-express-ts-app/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/create-sojeb-express-ts-app "npm"
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[synk-image]: https://img.shields.io/snyk/vulnerabilities/github/SojebSikder/create-sojeb-express-ts-app?label=Synk%20Vulnerabilities&style=for-the-badge
[synk-url]: https://snyk.io/test/github/SojebSikder/create-sojeb-express-ts-app?targetFile=package.json "synk"
