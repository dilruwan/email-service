/**
 * Run the test case
 * mocha email-service/test/api/email.js
 */

import YAML from "js-yaml";
import fs from "fs";
const emailMeta = YAML.load(fs.readFileSync(__dirname + '/../../src/metadata/email.yml'), 'utf8');
import validator from "../../src/validation/validator";
import should from "should";
import moment from "moment-timezone";

describe('Validator', function() {

    describe('isValidField function - string', function() {

        let fieldDef = emailMeta.fields.subject;

        it('should return true for valid string format', function () {
            let result = validator.isValidField(fieldDef, 'Sample subject');
            result.should.be.true();
        });

        it('should return error message for null value for required field', function () {
            let result = validator.isValidField(fieldDef, null);
            should.equal(result, fieldDef.label + " is mandatory. Please fill out this field.");
        });

        it('should return error message for empty value for required field', function () {
            let result = validator.isValidField(fieldDef, '');
            should.equal(result, fieldDef.label + " is mandatory. Please fill out this field.");
        });

        it('should return error message for invalid length field', function () {
            let subject = "Sample subject test test test test test test test test test test test test test testtest test test test test test testtest test test test test test testtest test test test test test testtest test test test test test test with more than 200 chars";
            let result = validator.isValidField(fieldDef, subject);
            should.equal(result, fieldDef.label + " should have length between 1-200 characters.");
        });
    });

    describe('isValidField function - pattern', function() {

        let fieldDef = emailMeta.fields.to;

        it('should return true for valid email format', function () {
            let result = validator.isValidField(fieldDef, 'test@example.com');
            result.should.be.true();
        });

        it('should return error message for invalid pattern - special characters', function () {
            let result = validator.isValidField(fieldDef, 'test%$test@example.com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });

        it('should return error message for invalid pattern - spaces characters', function () {
            let result = validator.isValidField(fieldDef, 'tes test@example.com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });

        it('should return error message for invalid pattern - format', function () {
            let result = validator.isValidField(fieldDef, 'test@example@com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });

        it('should return error message for invalid pattern - format', function () {
            let result = validator.isValidField(fieldDef, 'test@example');
            should.equal(result, fieldDef.label + " email address is invalid");
        });

        it('should return error message for invalid pattern - format', function () {
            let result = validator.isValidField(fieldDef, '@testexample.com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });

        it('should return error message for invalid pattern - format', function () {
            let result = validator.isValidField(fieldDef, 'test&example@com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });
        it('should return error message for invalid pattern - format', function () {
            let result = validator.isValidField(fieldDef, '@.com');
            should.equal(result, fieldDef.label + " email address is invalid");
        });
    });

    describe('isValidUid function', function() {

        it('should return true for valid uid format', function () {
            let result = validator.isValidUid('07fafe5c-27e4-41b8-b82f-fd737b8b497c');
            result.should.be.true();
        });

        it('should return false for empty uid', function () {
            let result = validator.isValidUid('');
            result.should.be.false();
        });

        it('should return false for null uid', function () {
            let result = validator.isValidUid(null);
            result.should.be.false();
        });

        it('should return false for invalid uid format - special chars', function () {
            let result = validator.isValidUid('@$%-invalid-uyr78346c-ryt37t46c2er43');
            result.should.be.false();
        });

        it('should return false for invalid uid format - spaces', function () {
            let result = validator.isValidUid('07fafe5c-27e4- 41b8-b82f-fd737b8b497c');
            result.should.be.false();
        });

        it('should return false for invalid uid format - less than 3 chars', function () {
            let result = validator.isValidUid('07');
            result.should.be.false();
        });

        it('should return false for invalid uid format - greater than 50 chars', function () {
            let result = validator.isValidUid('07fafe5c-27e4-41b8-b82f-fd737b8b497c-07fafe5c-27e4-41b8-b82f');
            result.should.be.false();
        });
    });

    describe('isInSydneyPeakTime function', function() {

        it('Checking sydney time against current time', function () {
            let result = validator.isInSydneyPeakTime();

            let sydneyTime = new Date().toLocaleString("en-US", {timeZone: "Australia/Sydney"});
            sydneyTime = new Date(sydneyTime);
            let date = sydneyTime.getFullYear() + "-" + ((sydneyTime.getMonth() + 1).toString().length == 1 ? ("0" + (sydneyTime.getMonth() + 1).toString()) : (sydneyTime.getMonth() + 1).toString()) + "-" + sydneyTime.getDate();
            let time = sydneyTime.getHours() + ":" + sydneyTime.getMinutes() + ":" + (sydneyTime.getSeconds().toString().length == 1 ? ("0" + sydneyTime.getSeconds().toString()) : sydneyTime.getSeconds().toString());
            let sydneyCurrentTime = date + " " + time;
            let peakTimeStart = date + " " + "08:00:00";
            let peakTimeEnd = date + " " + "17:00:00";

            if (Date.parse(sydneyCurrentTime) >= Date.parse(peakTimeStart) && Date.parse(sydneyCurrentTime) <= Date.parse(peakTimeEnd)) {
                result.should.be.true();
            } else {
                result.should.be.false();
            }
        });
    });

});
