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
    const { page_schema, page_name, author, create_time, last_operate_time } = pageInfo;
    await ctx.render('editor.hbs', {
      page_name,
      page_schema,
      pageInfo: JSON.stringify({
        page_id,
        page_name,
        author,
        create_time,
        last_operate_time,
      }),
      componentTypeInfoList: JSON.stringify(componentTypeInfoList),
      componentInfoGroup: JSON.stringify(componentInfoGroup),
      user: JSON.stringify({ nickname, profile }),
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
    const { page_schema, page_name, author, create_time, last_operate_time } = pageInfo;
    await ctx.render('preview.hbs', {
      page_name,
      page_schema,
      pageInfo: JSON.stringify({
        page_id,
        page_name,
        author,
        create_time,
        last_operate_time,
      }),
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
