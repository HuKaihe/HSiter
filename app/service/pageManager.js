'use strict';

const Service = require('egg').Service;

class PageService extends Service {
  async getPageList() {
    const pageList = (await this.app.mysql.select('page', { user_id: 10001 }));
    return pageList;
  }
  async getPage(page_id) {
    const page = (await this.app.mysql.get('page', { page_id }));
    return page;
  }
  async addNewPage(newPageInfo) {
    const result = await this.app.mysql.insert('page', newPageInfo);
    return result;
  }
  async deletePage(page_id) {
    const result = await this.app.mysql.delete('page', { page_id });
    return result;
  }
}

module.exports = PageService;
