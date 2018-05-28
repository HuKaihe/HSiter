'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
  async checkEmailValid(email) {
    const repeatedEmail = (await this.app.mysql.get('user', {
      email,
    }));
    if (repeatedEmail) {
      return false;
    }
    return true;
  }
  async signup(userInfo) {
    await this.app.mysql.insert('user', userInfo);
    const { user_id } = (await this.app.mysql.query('select LAST_INSERT_ID() as user_id'))[0];
    const user = (await this.app.mysql.get('user', { user_id }));
    return user;
  }
  async login(userInfo) {
    const user = (await this.app.mysql.get('user', userInfo));
    return user;
  }
}

module.exports = AccountService;
