'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  // 视图层
  router.get('/', middleware.checkLogin, controller.pageManager.index);
  router.get('/editor', middleware.checkLogin, controller.editor.index);
  router.get('/preview', middleware.checkLogin, controller.editor.preview); // 页面预览
  router.get('/pageManager', middleware.checkLogin, controller.pageManager.index);
  router.get('/signup', controller.account.signupIndex);
  router.get('/login', controller.account.loginIndex);

  // 编辑器
  router.post('/editor/save', middleware.checkLogin, controller.editor.save); // 保存页面

  // 页面管理
  router.post('/pageManager/newPage', middleware.checkLogin, controller.pageManager.addNewPage);
  router.post('/pageManager/editPage', middleware.checkLogin, controller.pageManager.editPage);
  router.post('/pageManager/deletePage', middleware.checkLogin, controller.pageManager.deletePage);
  router.post('/pageManager/copyPage', middleware.checkLogin, controller.pageManager.copyPage);

  // 账号管理
  router.post('/account/checkEmailValid', controller.account.checkEmailValid);
  router.post('/account/signup', controller.account.signup);
  router.post('/account/login', controller.account.login);
  router.post('/account/signout', middleware.checkLogin, controller.account.signout);
};
