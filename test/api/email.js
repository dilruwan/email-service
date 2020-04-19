/**
 * Run the test case
 * mocha email-service/test/api/email.js
 */

import constants from "../../src/constants/appConstants";
import EmailModule from "../../src/modules/email";
import should from "should";
import sinon from "sinon";
import { Email } from "../../src/models";
import { Promise } from "bluebird";

let uid = '1fb023b4-b523-42c8-a882-0005ab98e1hr';

describe('Email', function() {
    let emailCreateStub;
    let emailFindStub;
    let emailUpdateStub;
    let emailDeleteStub;

    before(function() {
        emailCreateStub = sinon.stub(Email, 'create');
        emailFindStub = sinon.stub(Email, 'findOne');
        emailUpdateStub = sinon.stub(Email, 'update');
        emailDeleteStub = sinon.stub(Email, 'destroy');
    });

    describe('Email create function', function() {

        it('should return promise for valid data', function () {
            let emailData = {
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            };

            emailCreateStub.returns(Promise.resolve({
                id: 5,
                uid: uid,
                ...emailData
            }));

            let result = EmailModule.create(emailData);
            return result.should.be.a.Promise();
        });

        it('should create uid for valid data', function () {
            let emailData = {
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            };

            emailCreateStub.returns(Promise.resolve({
                id: 5,
                uid: uid,
                ...emailData
            }));

            return EmailModule.create(emailData).then((email) => {
                email.should.have.property('uid');
            });
        });

        it('should return rejected promise for invalid data - empty to', function () {
            let emailData = {
                to: '',
                subject: 'Sample subject',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = EmailModule.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - invalid email address to', function () {
            let emailData = {
                to: 'invalid-email',
                subject: 'Sample subject',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = EmailModule.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - empty subject', function () {
            let emailData = {
                to: 'test@example.com',
                subject: '  ',
                content: 'Sample content',
                status: constants.QUEUED
            };
            let result = EmailModule.create(emailData);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for invalid data - empty content', function () {
            let emailData = {
                to: 'test@example.com',
                subject: 'Sample subject',
                content: '',
                status: constants.QUEUED
            };
            let result = EmailModule.create(emailData);
            return result.should.be.a.rejected();
        });

    });

    describe('Email find function', function() {

        it('should return promise for valid uid', function () {
            emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                id: 5,
                uid: uid,
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            }));

            let result = EmailModule.find(uid);
            return result.should.be.a.Promise();
        });

        it('should return email data for valid uid', function () {
            emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                id: 5,
                uid: uid,
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            }));

            let result = EmailModule.find(uid).then((email) => {
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
            emailFindStub.withArgs({where: {uid: notExistingUid}}).returns(Promise.resolve());
            let result = EmailModule.find(notExistingUid).then((email) => {
                should.equal(email, null);
            });
            return result.should.be.a.Promise();
        });

        it('should return rejected promise for invalid uid', function () {
            let invalidUid = "@_invalid-346c-4898-8454-fd71b699999";
            let result = EmailModule.find(invalidUid);
            return result.should.be.a.rejected();
        });

    });

    describe('Email update status function', function() {
        it('should update email status to given status', function () {
            emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                id: 5,
                uid: uid,
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.QUEUED
            }));

            emailUpdateStub.withArgs({
                status: constants.SENT
            }, {
                returning: true,
                where: {
                    uid: uid
                }
            }).returns(Promise.resolve({
                id: 5,
                uid: uid,
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.SENT
            }));

            return EmailModule.find(uid).then((email) => {
                email.should.have.property('status', constants.QUEUED);
            }).then(() => {
                return EmailModule.updateStatus(uid, constants.SENT).then((updatedData) => {
                    updatedData.should.have.property('status', constants.SENT);
                });
            }).then(() => {
                emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                    id: 5,
                    uid: uid,
                    to: 'test@example.com',
                    subject: "Sample subject",
                    content: "Sample content",
                    status: constants.SENT
                }));
                return EmailModule.find(uid).then((email) => {
                    email.should.have.property('status', constants.SENT);
                });
            });
        });

    });

    describe('Email delete function', function() {

        it('should return rejected promise for invalid uid', function () {
            let invalidUid = "@_invalid-346c-4898-8454-fd71b699999";
            let result = EmailModule.delete(invalidUid);
            return result.should.be.a.rejected();
        });

        it('should return rejected promise for not existing uid', function () {
            let notExistingUid = 'not-existing-rv3223cr-32rcx3rc';
            emailFindStub.withArgs({where: {uid: notExistingUid}}).returns(Promise.resolve());
            let result = EmailModule.delete(notExistingUid);
            return result.should.be.a.rejected();
        });

        it('should delete email successfully for valid uid', function () {
            emailDeleteStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                id: uid,
                deleted: true
            }));

            emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve({
                id: 5,
                uid: uid,
                to: 'test@example.com',
                subject: "Sample subject",
                content: "Sample content",
                status: constants.SENT
            }));
            return EmailModule.find(uid).then((email) => {
                email.should.have.property('subject');
            }).then(() => {
                return EmailModule.delete(uid).then((deleteResponse) => {
                    deleteResponse.should.have.property('id', uid);
                    deleteResponse.should.have.property('deleted', true);
                });
            }).then(() => {
                emailFindStub.withArgs({where: {uid: uid}}).returns(Promise.resolve());
                let result = EmailModule.find(uid).then((email) => {
                    should.equal(email, null);
                });
            });
        });
    });
});
