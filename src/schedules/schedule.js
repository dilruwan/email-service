import emailModule from '../modules/email';
import { Promise } from "bluebird";
import mailer from '../services/mailer';
import constants from "../constants/appConstants";

/**
 * Schedule Tasks
 */
module.exports = {
    sendQueuedEmails() {
        return emailModule.getQueuedEmails().then((emails) => {
            return Promise.map(emails, function(email) {
                return mailer.send(email).then((mailResponse) => {
                    return emailModule.updateStatus(email.uid, constants.SENT).then((updateResponse) => {
                        return updateResponse;
                    });
                }).catch((error) => {
                    console.log('Offline email sending failed - ' + email.uid);
                    return emailModule.updateStatus(email.uid, constants.FAILED).then((updateResponse) => {
                        return updateResponse;
                    });
                });
            });
        });
    }
}