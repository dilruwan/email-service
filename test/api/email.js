/**
 * Run the test case
 * mocha email-service/test/api/email.js
 */

import constants from "../../src/constants/appConstants";
import should from "should";
import Email from "../../src/modules/email";

let uid = null;

describe('Email', function() {
    before(function() {
        // Create test email
        let data = {
            to: 'test@example.com',
            subject: "Sample subject",
            content: "Sample content",
            status: constants.QUEUED
        };
        return Email.create(data).then((email) => {
            uid = email.uid;
        });
    });

    describe('Email create function', function() {

        it('should return promise for valid data', function () {
            let emailData = {
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            };
            let result = Email.create(emailData);
            return result.should.be.a.Promise();
        });

        it('should create uid for valid data', function () {
            let emailData = {
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            };
            return Email.create(emailData).then((email) => {
                email.should.have.property('uid');
            });
            return result.should.be.a.Promise();
        });

        it('should return rejected promise for invalid data - empty to', function () {
            let emailData = {
                to: '',
                subject: 'Sample subject',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = Email.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - invalid email address to', function () {
            let emailData = {
                to: 'invalid-email',
                subject: 'Sample subject',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = Email.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - empty subject', function () {
            let emailData = {
                to: 'test@example.com',
                subject: '  ',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = Email.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - empty content', function () {
            let emailData = {
                to: 'test@example.com',
                subject: 'Sample subject',
                content: '',
                status: constants.QUEUED
            };
            let result = Email.create(emailData);
            return result.should.be.a.rejected();
        });

    });

    describe('Email find function', function() {

        it('should return promise for valid uid', function () {
            let result = Email.find(uid);
            return result.should.be.a.Promise();
        });

        it('should return email data for valid uid', function () {
            let result = Email.find(uid).then((email) => {
                email.should.have.property('uid', uid);
                email.should.have.property('to', 'test@example.com');
                email.should.have.property('subject', 'Sample subject');
                email.should.have.property('content', 'Sample content');
                email.should.have.property('status', constants.QUEUED);
                return result.should.be.a.Promise();
            });
        });

        it('should return empty email data for not existing uid', function () {
            let notExistingUid = 'not-existing-rv3223cr-32rcx3rc';
            let result = Email.find(notExistingUid).then((email) => {
                should.equal(email, null);
            });
            return result.should.be.a.Promise();
        });

        it('should return rejected promise for invalid uid', function () {
            let invalidUid = "@_invalid-346c-4898-8454-fd71b699999";
            let result = Email.find(invalidUid);
            return result.should.be.a.rejected();
        });

    });

    describe('Email update status function', function() {

        it('should update email status to given status', function () {
            return Email.find(uid).then((email) => {
                email.should.have.property('status', constants.QUEUED);
            }).then(() => {
                return Email.updateStatus(uid, constants.SENT);
            }).then(() => {
                return Email.find(uid).then((email) => {
                    email.should.have.property('status', constants.SENT);
                });
            });
        });

    });

    describe('Email delete function', function() {

        it('should return rejected promise for invalid uid', function () {
            let invalidUid = "@_invalid-346c-4898-8454-fd71b699999";
            let result = Email.delete(invalidUid);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for not existing uid', function () {
            let notExistingUid = 'not-existing-rv3223cr-32rcx3rc';
            let result = Email.delete(notExistingUid);
            return result.should.be.a.rejected();
        });

        it('should delete email successfully for valid uid', function () {
            return Email.find(uid).then((email) => {
                email.should.have.property('subject');
            }).then(() => {
                return Email.delete(uid);
            }).then(() => {
                let result = Email.find(uid).then((email) => {
                    should.equal(email, null);
                });
            });
        });
    });
});
