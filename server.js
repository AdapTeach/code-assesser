'use strict';
require('./config/init')();
var config = require('./config/config'),
    app = require('./config/express')();
app.listen(config.port);
console.log('Code-assesser api started on port ' + config.port);