'use strict';
const Controller = require('egg').Controller;

class EditorController extends Controller {

  async index() {
    const ctx = this.ctx;
    const { user_id, nickname, profile } = ctx.session.user;

    const page_id = this.ctx.query.page;

    const componentTypeInfoList = await this.service.editor.getComponentTypeInfoList() || [];
    const componentCollectionList = await this.service.editor.getCollectionList() || [];

    const componentInfoGroup = componentCollectionList.map(item => ({
      ...item,
      children: componentTypeInfoList.filter(i => i.collection === item.code),
    }));

    const pageInfo = await this.service.pageManager.getPage(page_id, user_id);
    if (!pageInfo) {
      await ctx.render('404.hbs');
      return;
    }
    const { page_schema, page_title, author, create_time, last_operate_time } = pageInfo;

    // 数据加密
    const encryptedPageSchema = ctx.helper.encrypt(page_schema);
    const { encryptedKey, originKey } = encryptedPageSchema;
    const encryptedUser = ctx.helper.encrypt({ nickname, profile }, encryptedKey);
    const encryptedPageInfo = ctx.helper.encrypt({
      page_id,
      author,
      create_time,
      last_operate_time,
    }, encryptedKey);
    const encryptedComponentInfoGroup = ctx.helper.encrypt(componentInfoGroup, encryptedKey);
    const encryptedComponentTypeInfoList = ctx.helper.encrypt(componentTypeInfoList, encryptedKey);

    await ctx.render('editor.hbs', {
      originKey,
      page_title,
      page_schema: encryptedPageSchema.value,
      pageInfo: encryptedPageInfo.value,
      componentTypeInfoList: encryptedComponentTypeInfoList.value,
      componentInfoGroup: encryptedComponentInfoGroup.value,
      user: encryptedUser.value,
    });
  }

  // 页面预览
  async preview() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;

    const page_id = this.ctx.query.page;
    const pageInfo = await this.service.pageManager.getPage(page_id, user_id);
    if (!pageInfo) {
      await ctx.render('404.hbs');
      return;
    }
    const { page_schema, page_title, author, create_time, last_operate_time } = pageInfo;

    // 数据加密
    const encryptedPageSchema = ctx.helper.encrypt(page_schema);
    const { encryptedKey, originKey } = encryptedPageSchema;
    const encryptedPageInfo = ctx.helper.encrypt({
      page_id,
      author,
      create_time,
      last_operate_time,
    }, encryptedKey);
    await ctx.render('preview.hbs', {
      originKey,
      page_title,
      page_schema: encryptedPageSchema.value,
      pageInfo: encryptedPageInfo.value,
    });
  }

  async save() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id, page_schema } = ctx.request.body;
    const last_operate_time = new Date();
    const result = await this.service.editor.updatePageSchema({ page_id, user_id, page_schema, last_operate_time });
    if (!result) {
      ctx.body = {
        code: 500,
        msg: 'fail',
      };
    }
    ctx.body = {
      code: 200,
      msg: 'success',
    };
  }
}

module.exports = EditorController;
