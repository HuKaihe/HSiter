'use strict';

module.exports = async function checkLogin(ctx, next) {
  const hasLogin = ctx.session.user;
  if (hasLogin) {
    await next();
    return;
  }
  await ctx.render('login.hbs');
  console.log('用户未登录');
};
