'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 主页
  router.get('/', controller.pageManager.index);

  // 编辑器
  router.get('/editor', controller.editor.index); // 视图接口
  router.post('/editor/save', controller.editor.save); // 保存页面
  router.get('/preview', controller.editor.preview); // 页面预览

  // 页面管理
  router.get('/pageManager', controller.pageManager.index);
  router.post('/pageManager/newPage', controller.pageManager.addNewPage);
  router.post('/pageManager/deletePage', controller.pageManager.deletePage);
};
