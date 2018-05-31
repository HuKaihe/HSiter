'use strict';
const Controller = require('egg').Controller;

class EditorController extends Controller {

  async index() {
    const ctx = this.ctx;
    const { user_id, nickname, profile } = ctx.session.user;

    const page_id = ctx.query.page;

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
    const { page_schema, page_title, author, create_time, last_operate_time, page_url } = pageInfo;

    // 数据加密
    const encryptedPageSchema = ctx.helper.encrypt(page_schema);
    const { encryptedKey, originKey } = encryptedPageSchema;
    const encryptedUser = ctx.helper.encrypt({ nickname, profile }, encryptedKey);
    const encryptedPageInfo = ctx.helper.encrypt({
      page_id,
      author,
      create_time,
      last_operate_time,
      page_url,
      page_title,
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
    const isPrePublish = ctx.request.url.split('?')[0] === '/prePublish';

    const page_id = ctx.query.page;
    const pageInfo = await this.service.pageManager.getPage(page_id, user_id);
    if (!pageInfo) {
      await ctx.render('404.hbs');
      return;
    }
    const { page_schema, page_title, author, create_time, last_operate_time, page_url } = pageInfo;

    // 数据加密
    const encryptedPageSchema = ctx.helper.encrypt(page_schema);
    const { encryptedKey, originKey } = encryptedPageSchema;
    const encryptedPageInfo = ctx.helper.encrypt({
      page_id,
      author,
      create_time,
      last_operate_time,
      page_url,
      page_title,
    }, encryptedKey);
    await ctx.render('preview.hbs', {
      pp: isPrePublish,
      originKey,
      page_title: isPrePublish ? (page_title + '——预发') : (page_title + '——预览'),
      page_schema: encryptedPageSchema.value,
      pageInfo: encryptedPageInfo.value,
    });
  }

  async publish() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id, bodyHTML, page_url, page_title } = ctx.request.body;
    const newPageUrl = `/public/pages/${user_id}/${page_url}.html`;
    const result = await this.service.editor.publishPage({ page_id, user_id, publish_url: newPageUrl, publish_date: new Date() });
    if (!result) {
      ctx.body = { code: 500, msg: '服务器异常' };
      return;
    }
    try {
      await ctx.service.editor.publishPageRender({ bodyHTML, page_title, user_id, page_url });
      ctx.body = { code: 200, payload: { newPageUrl }, msg: 'success' };
    } catch (e) {
      console.error(e);
      ctx.body = { code: 500, newPageUrl, msg: '服务器错误' };
    }
  }

  async save() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id, page_schema } = ctx.request.body;
    const result = await this.service.editor.updatePageSchema({ page_id, user_id, page_schema });
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
