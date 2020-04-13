import response from '../response/index';
import validator from '../validation/validator';
import constants from '../constants/appConstants';
import mailer from '../services/mailer';
import emailModule from '../modules/email';

/**
 * Email Controller
 */
module.exports = {
    /**
     * Create email action
     */
    create(req, res) {
        let data = {
            to: req.body.to,
            subject: req.body.subject,
            content: req.body.content,
            status: constants.QUEUED
        };

        return emailModule.create(data).then((email) => {
            if (validator.isInSydneyPeakTime()) {
                return mailer.send(email).then((mailResponse) => {
                    return emailModule.updateStatus(email.uid, constants.SENT).then(() => {
                        return res.status(200).send(
                            response.success(200, {id: email.uid, status: constants.SENT}, "Success")
                        );
                    });
                }).catch((error) => {
                    console.log('Ontime email sending failed');
                    return emailModule.updateStatus(email.uid, constants.FAILED).then(() => {
                        return res.status(200).send(
                            response.success(200, {id: email.uid, status: constants.FAILED}, "Success")
                        );
                    });
                });
            }
            return res.status(200).send(
                response.success(200, {id: email.uid, status: email.status}, "Success")
            );
        }).catch((error) => {
            return res.status(400).send(error);
        });
    },
    /**
     * Find email by id (uid) action
     */
    findByUid(req, res) {
        return emailModule.find(req.params.id).then((email) => {
            if (!email) {
                return res.status(404).send(
                    response.error(404, 'Email Not Found')
                );
            }

            return res.status(200).send(
                response.success(200, {id: email.uid, status: email.status}, "Success")
            );
        }).catch((error) => {
            res.status(400).send(error)
        });
    },
    /**
     * Delete an email by id (uid) action
     */
    destroy(req, res) {
        return emailModule.delete(req.params.id).then((result) => {
            console.log(result);
            return res.status(201).send(
                response.success(201, result, "Email was deleted successfully")
            );
        }).catch((error) => {
            res.status(400).send(error)
        });
    },
};
