var _ = require('lodash'),
    assessmentData = require('./assessments'),
    http = require("q-io/http");

var routes = {};

var getAssessment = function (request, response) {
    var assessmentId = request.params.assessmentId;
    return assessmentData.get(assessmentId).then(function (assessment) {
        if (assessment) {
            return _.cloneDeep(assessment);
        } else {
            response.status(404).send('No assessment found for ' + assessmentId);
        }
    });
};

routes.publish = function (router) {
    router.post('/assess/reloadData', function (request, response) {
        assessmentData.reload()
            .then(function () {
                response.send('OK');
            });
    });

    router.get('/assess/:assessmentId', function (request, response) {
        getAssessment(request, response).then(function (assessment) {
            delete assessment.className;
            delete assessment.tests;
            delete assessment.tips;
            delete assessment.guides;
            response.send(assessment);
        });
    });

    router.post('/assess/:assessmentId', function (request, response) {
        getAssessment(request, response).then(function (assessment) {
            var submittedCode = request.body.code;
            var options = {
                url: 'http://localhost:5020/v1/',
                method: 'POST',
                body: [
                    JSON.stringify({
                        assessment: {
                            title: assessment.title,
                            className: assessment.className,
                            tests: assessment.tests
                        },
                        code: submittedCode
                    })
                ]
            };
            http.request(http.normalizeRequest(options))
                .then(function (submissionResponse) {
                    submissionResponse.body.read().then(function (body) {
                        response
                            .status(submissionResponse.status)
                            .send(body);
                    });
                });
        });
    });

};

module.exports = routes;