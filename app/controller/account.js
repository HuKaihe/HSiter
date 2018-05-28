'use strict';
const Controller = require('egg').Controller;

class AccountController extends Controller {

  async signupIndex() {
    const { ctx } = this;
    // ctx.session.user = null;
    await ctx.render('signup.hbs');
  }

  async loginIndex() {
    const { ctx } = this;
    // ctx.session.user = null;
    await ctx.render('login.hbs');
  }

  // 为后面引入同构方案做铺垫
  async checkEmailValid() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    const isEmailValid = await this.service.account.checkEmailValid(email);
    if (isEmailValid) {
      ctx.body = {
        code: 200,
        msg: 'success',
      };
      return;
    }
    ctx.body = {
      code: 400,
      msg: 'email repeat',
    };
  }

  async signup() {
    const { ctx } = this;
    const userInfo = {
      ...ctx.request.body,
      signup_time: new Date(),
      last_login_time: new Date(),
      is_admin: false,
      profile: `/public/image/user_profile/profile_${Math.ceil(Math.random() * 10)}.png`,
    };
    const user = await this.service.account.signup(userInfo);
    ctx.session.user = { ...user, password: '' };
    if (user) {
      ctx.body = {
        code: 200,
        msg: 'success',
      };
      return;
    }
    ctx.body = {
      code: 400,
      msg: 'signup fail',
    };
  }

  async login() {
    const { ctx } = this;
    const userInfo = ctx.request.body;
    ctx.user = null;
    const user = await this.service.account.login(userInfo);
    ctx.session.user = { ...user, password: '' };
    if (user) {
      ctx.body = {
        code: 200,
        msg: 'success',
      };
      return;
    }
    ctx.body = {
      code: 300,
      msg: '用户不存在或者密码错误',
    };
  }

  async signout() {
    const { ctx } = this;
    if (ctx.session.user) {
      ctx.session.user = null;
      ctx.body = {
        code: 200,
        msg: 'success',
      };
      return;
    }
    ctx.body = {
      code: 300,
      msg: '账户登录异常',
    };
  }
}

module.exports = AccountController;
