const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
import cron from 'node-cron';
import schedules from './src/schedules/schedule';

require('dotenv').config();

const app = express();

app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/routes')(app);

cron.schedule('* 08 * * *', () => {
    console.log('Runing cronjob - send queued emails started 08.00 AM at Australia/Sydney timezone');
    schedules.sendQueuedEmails();
}, {
    scheduled: true,
    timezone: "Australia/Sydney"
});

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to email service.',
}));

module.exports = app;
