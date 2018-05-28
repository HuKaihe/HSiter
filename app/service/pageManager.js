'use strict';

const Service = require('egg').Service;

class PageService extends Service {
  async getPageList(user_id) {
    const pageList = (await this.app.mysql.select('page', { where: { user_id } }));
    return pageList;
  }
  async getPage(page_id, user_id) {
    const page = (await this.app.mysql.get('page', { page_id, user_id }));
    return page;
  }
  async addNewPage(newPageInfo) {
    const result = await this.app.mysql.insert('page', newPageInfo);
    return result;
  }
  async deletePage(page_id, user_id) {
    const result = await this.app.mysql.delete('page', { page_id, user_id });
    return result;
  }
}

module.exports = PageService;
