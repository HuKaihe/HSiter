'use strict';

module.exports = async function checkLogin(ctx, next) {
  const hasLogin = ctx.session.user;
  if (hasLogin) {
    console.log(ctx.session.user);
    await next();
    return;
  }
  console.log('用户未登录');
};
