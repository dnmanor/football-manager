# Football Manager Online

A football fantasy manager that allows users to manage their teams
and buy players.

## Requirements
- docker
- yarn
- node

## Setup

- install dependencies
```bash
yarn install
```
- setup database and queue service 
```bash
docker compose up -d
```

- run migrations
```bash
cd apps/api && npx prisma migrate dev
```

- run the app
```bash
cd ../../ && yarn dev
```

### Notes 
- the webapp will run on port localhost:3000
- the api will run on port localhost:800
- the queue service will run on port localhost:5672 (15672 for management ui)

## Features

- [x] User can sign up and login
- [x] User can create a team
- [x] User can buy players
- [x] User can sell players and alter player pricing
- [x] User can view their team
- [x] User can view the market
- [x] User can logout


Other Features
- [x] Logging

