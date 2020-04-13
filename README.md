# Email management service RestAPI project installation document

### Prerequisites

- nodejs
- npm
- mysql

## Setup dev environment

- Clone the code from git repository
```
git clone git@github.com:dilruwan/email-service.git
```

- Checkout to the project directory
```
cd email-service
```

- Install npm libraries
```
npm install
```
- Update database configurations
  - Create a database (eg. email_service)
  - Update src/config/config.json `development` section accordingly
- Create `.env` file by using `.env.dist` (.env is gitignored) in the same root directory. API service running custom port `2010` is defined there.

- Run database migrations
```
npx sequelize-cli db:migrate
```

- Email service - SendGrid
    - Update `SENDGRID_API_KEY` on `.env` with your sendGrid API KEY
    - Update `FROM_EMAIL_ADDRESS` on `.env` of a verified Sender
    https://sendgrid.com

- Run the server
```
npm start
```
```
Server is running at http://localhost:2010
```

- Run mocha test cases
```
npm test
```

### Tested on
  - node v12.5.0
  - npm 6.9.0

### Sample curl requests
- Crete email request [POST]
```
curl -d '{"to":"<VALID-EMAIL-ADDRESS>","subject":"Test subject","content":"Test content"}' -H 'Content-Type: application/json' http://localhost:2010/v1/emails
```

- Get the current status of an email [GET]
```
curl http://localhost:2010/v1/emails/<Email-ID>
```

- Delete an email [DELETE]
```
curl -X DELETE http://localhost:2010/v1/emails/<Email-ID>
```
