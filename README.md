# node-ecommerce

NodeJS multivendor ecommerce application

## Features:

- Written in Typescript
- Multivendor support
- Paypal, stripe payment gateway integration
- Order receipt pdf generation
- And much more.

## Configure

- Set up database credentials in env file
- Migrate database using this command:
  `npx prisma migrate dev`

## Installing

```
yarn install
```

## Production

### Build

```
yarn build
```

### Running

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

- (Boilerplate) http://github.com/sojebsikder/create-sojeb-express-ts-app

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
