import { Email } from "../models";
import { Promise } from "bluebird";
import validator from '../validation/validator';
import response from "../response/index";
import YAML from "js-yaml";
import fs from "fs";
const emailMeta = YAML.load(fs.readFileSync(__dirname + '/../metadata/email.yml'), 'utf8');
import constants from '../constants/appConstants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Email Module
 */
module.exports = {
    /**
     * Create email
     */
    create(data) {
        let uid = uuidv4();
        data.uid = uid;
        let errors = validator.validate(emailMeta, data);
        if (errors.length) {
            return Promise.reject(response.error(400, errors));
        }

        return Email.create(data);
    },
    /**
     * Find email
     */
    find(id) {
        let isValid = validator.isValidUid(id);
        if (!isValid) {
            return Promise.reject(response.error(400, ['Invalid id']));
        }

        return Email.findOne({
            where: {
                uid: id
            }
        });
    },
    /**
     * Update email
     */
    updateStatus(uid, status) {
        return this.find(uid).then((email) => {
            if (email) {
                return email.update({status: status});
            }
            return email;
        });
    },
    /**
     * Delete email
     */
    delete(uid) {
        return this.find(uid).then((email) => {
            if (email) {
                let result = {
                    id: email.uid,
                    deleted: true
                };
                return email.destroy().then(() => {
                    return result;
                });
            }

            return Promise.reject(response.error(404, ['Email not found']));
        });
    },
    /**
     * Get queued emails
     */
    getQueuedEmails() {
        return Email.findAll({
            where: {
                status: constants.QUEUED
            }
        });
    },
}