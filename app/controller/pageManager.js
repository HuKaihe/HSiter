'use strict';
const Controller = require('egg').Controller;

class PageManagerController extends Controller {

  // 为后面引入同构方案做铺垫
  async index() {
    const ctx = this.ctx;
    const pageList = await this.service.pageManager.getPageList();
    await ctx.render('pageManager.hbs', {
      pageList: JSON.stringify(pageList),
    });
  }

  async addNewPage() {
    const ctx = this.ctx;
    const reqData = ctx.request.body;
    const page_id = ctx.helper.getRandomString();
    const newPageInfo = {
      page_id,
      author: '胡凯赫',
      user_id: 10001,
      page_schema: '{layoutSchema:[],componentSchema:[],baseConfig:{}}',
      create_time: new Date(),
      last_operate_time: new Date(),
      ...reqData,
    };
    await this.service.pageManager.addNewPage(newPageInfo);
    const pageList = await this.service.pageManager.getPageList();
    ctx.body = {
      code: 200,
      message: '',
      payload: {
        page_id,
        pageList,
      },
    };
  }

  async deletePage() {
    const ctx = this.ctx;
    const { page_id } = ctx.request.body;
    await this.service.pageManager.deletePage(page_id);
    const pageList = await this.service.pageManager.getPageList();
    ctx.body = {
      code: 200,
      message: '',
      payload: {
        pageList,
      },
    };
  }
}

module.exports = PageManagerController;
