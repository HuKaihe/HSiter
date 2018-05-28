'use strict';
const Controller = require('egg').Controller;

class PageManagerController extends Controller {

  // 为后面引入同构方案做铺垫
  async index() {
    const ctx = this.ctx;
    const { user_id, nickname, profile } = ctx.session.user;
    console.log(user_id);
    const pageList = await this.service.pageManager.getPageList(user_id);
    await ctx.render('pageManager.hbs', {
      pageList: JSON.stringify(pageList),
      user: JSON.stringify({ nickname, profile }),
    });
  }

  async addNewPage() {
    const ctx = this.ctx;
    const { user_id, nickname: author } = ctx.session.user;
    const reqData = ctx.request.body;
    const page_id = ctx.helper.getRandomString();
    const newPageInfo = {
      page_id,
      author,
      user_id,
      page_schema: '{layoutSchema:[],componentSchema:[],baseConfig:{}}',
      create_time: new Date(),
      last_operate_time: new Date(),
      ...reqData,
    };
    await this.service.pageManager.addNewPage(newPageInfo);
    const pageList = await this.service.pageManager.getPageList(user_id);
    ctx.body = {
      code: 200,
      msg: '',
      payload: {
        page_id,
        pageList,
      },
    };
  }

  async deletePage() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id } = ctx.request.body;
    await this.service.pageManager.deletePage(page_id, user_id);
    const pageList = await this.service.pageManager.getPageList(user_id);
    ctx.body = {
      code: 200,
      msg: '',
      payload: {
        pageList,
      },
    };
  }
}

module.exports = PageManagerController;
