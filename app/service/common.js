'use strict';

const Service = require('egg').Service;

class CommonService extends Service {
  async common() {
    console.log('common');
  }
}

module.exports = CommonService;
