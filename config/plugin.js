'use strict';

// had enabled by egg
// exports.static = true;
exports.handlebars = {
  enable: true,
  package: 'egg-view-handlebars',
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
  credentials: true,
};

exports.session = true;
