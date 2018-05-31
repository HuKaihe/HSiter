'use strict';
const Controller = require('egg').Controller;

class PageManagerController extends Controller {

  // 为后面引入同构方案做铺垫
  async index() {
    const ctx = this.ctx;
    const { user_id, nickname, profile } = ctx.session.user;
    const pageList = await this.service.pageManager.getPageList(user_id);

    // 数据加密，user和pageList使用同一把秘钥加密
    const encryptedPageList = ctx.helper.encrypt(pageList);
    const { encryptedKey, originKey } = encryptedPageList;
    const encryptedUser = ctx.helper.encrypt({
      nickname, profile,
    }, encryptedKey);
    await ctx.render('pageManager.hbs', {
      originKey,
      pageList: encryptedPageList.value,
      user: encryptedUser.value,
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
      page_schema: JSON.stringify({ layoutSchema: [], componentSchema: [], baseConfig: {} }),
      create_time: new Date(),
      last_operate_time: new Date(),
      ...reqData,
    };
    const result = await this.service.pageManager.addNewPage(newPageInfo);
    if (!result) {
      ctx.body = {
        code: 300,
        msg: '新增页面失败',
      };
      return;
    }
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
  async editPage() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id, changedInfo } = ctx.request.body;
    const result = await this.service.pageManager.updatePageInfo(changedInfo, page_id, user_id);
    if (!result) {
      ctx.body = {
        code: 300,
        msg: '新增页面失败',
      };
      return;
    }
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
  async copyPage() {
    const ctx = this.ctx;
    const { user_id } = ctx.session.user;
    const { page_id } = ctx.request.body;
    const pageInfo = await this.service.pageManager.getPage(page_id, user_id);
    const new_page_id = ctx.helper.getRandomString();
    const newPageInfo = {
      ...pageInfo,
      page_name: pageInfo.page_name + '的副本',
      page_id: new_page_id,
      create_time: new Date(),
      last_operate_time: new Date(),
    };
    const result = await this.service.pageManager.addNewPage(newPageInfo);
    if (!result) {
      ctx.body = {
        code: 300,
        msg: '复制页面失败',
      };
      return;
    }
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
    const page = await this.service.pageManager.getPage(page_id, user_id);
    const { is_publish, publish_url } = page;
    if (is_publish) {
      try {
        await this.service.pageManager.deleteStaticPage(page_id, user_id, publish_url);
      } catch (e) {
        console.error(e);
      }
    }
    const result = await this.service.pageManager.deletePage(page_id, user_id);
    const pageList = await this.service.pageManager.getPageList(user_id);
    if (!result) {
      ctx.body = { code: 300, msg: 'fail' };
      return;
    }
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
