var http = require('q-io/http'),
    assessmentValidator = require('./assessmentValidator'),
    HttpError = require('../error/HttpError');

var assessments = {};

var DATA_URL = 'https://dl.dropboxusercontent.com/u/1278945/Static%20Data/code-assessments/';

assessments.get = function (assessmentId) {
    var url = DATA_URL + assessmentId;
    var options = {
        url: url,
        method: 'GET'
    };
    return http.request(options)
        .then(function handleError(response) {
            if (response.status !== 200) {
                HttpError.throw(response.status, 'Impossible to get assessment data');
            }
            return response;
        })
        .then(function readResponseBody(response) {
            return response.body.read();
        })
        .then(function parseAssessment(body) {
            try {
                return JSON.parse(body);
            } catch (error) {
                HttpError.throw(409, 'Assessment data is not valid JSON');
            }
        })
        .then(function validate(assessment) {
            if (assessmentValidator.validate(assessment)) {
                return assessment;
            } else {
                HttpError.throw(409, 'Assessment failed validation : ' + assessmentId);
            }
        });
};

module.exports = assessments;