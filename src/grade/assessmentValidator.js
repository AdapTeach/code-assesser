var validator = require('validator'),
    iz = require('iz');

var assessmentValidator = {};

var validateSingle = function (assessment) {
    var toReturn = true;
    var results = [
        validator.isLength(assessment.id, 2),
        validator.isLength(assessment.title, 2),
        validator.isLength(assessment.instructions, 10),
        validator.isLength(assessment.className, 2),
        validator.contains(assessment.startCode, 'public class ' + assessment.className + ' {'),
        iz(assessment.tests).anArray().minLength(1).valid,
        iz(assessment.tips).anArray().valid,
        iz(assessment.guides).anArray().valid
    ];
    results.forEach(function (result) {
        if (!result) {
            //console.log(results);
            toReturn = false;
        }
    });
    return toReturn;
};

assessmentValidator.validate = function (assessments) {
    var result = true;
    assessments.forEach(function (assessment) {
        if (!validateSingle(assessment)) {
            result = false;
        }
    });
    return result;
};

module.exports = assessmentValidator;