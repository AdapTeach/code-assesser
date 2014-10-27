var q = require('q'),
    http = require('q-io/http'),
    assessmentValidator = require('./assessmentValidator');

var assessments = {};

var data = {};

var DATA_URL = 'https://dl.dropboxusercontent.com/u/1278945/code-grader/assessments-java.json';

var loadData = function () {
    var options = {
        url: DATA_URL,
        method: 'GET'
    };
    return http.request(options)
        .then(function (response) {
            return response.body.read().then(function (body) {
                var assessments = JSON.parse(body).assessments;
                if (assessmentValidator.validate(assessments)) {
                    var newData = {};
                    JSON.parse(body).assessments.forEach(function (assessment) {
                        newData[assessment.id] = assessment;
                    });
                    data = newData;
                } else {
                    console.log('Failed validation, keeping old data');
                }
            });
        })
        .catch(function (error) {
            console.log('Error loading JSON from URL : ' + DATA_URL);
            console.log('Error : ' + error);
        });
};

loadData();

assessments.get = function (assessmentId) {
    var deferred = q.defer();
    var assessment = data[assessmentId];
    if (assessment) {
        deferred.resolve(assessment);
    } else { // Assessment not found, reload data and try again
        loadData().then(function () {
            deferred.resolve(data[assessmentId]);
        });
    }
    return deferred.promise;
};

assessments.reload = function () {
    return loadData();
};

module.exports = assessments;
