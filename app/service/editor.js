'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

class HomeService extends Service {
  async getComponentTypeInfoList() {
    const componentTypeInfoList = (await this.app.mysql.select('component'));
    componentTypeInfoList.forEach(el => {
      // 组件的初始化数据何配置schema由字符串解析为javascript对象
      el.config_schema = JSON.parse(el.config_schema || '{}');
      el.default_data = JSON.parse(el.default_data || '{}');
    });
    return componentTypeInfoList;
  }
  async getCollectionList() {
    const collectionList = (await this.app.mysql.select('collection'));
    collectionList.forEach(el => {
      el.splitter = !!el.splitter;
    });
    return collectionList;
  }
  async updatePageSchema({ page_id, user_id, page_schema }) {
    const row = { page_schema };
    const option = {
      where: {
        page_id,
        user_id,
      },
    };
    const result = (await this.app.mysql.update('page', row, option));
    return result.affectedRows === 1;
  }
  async publishPage({ page_id, user_id, publish_date, publish_url }) {
    const option = {
      where: {
        page_id,
        user_id,
      },
    };
    const result = (await this.app.mysql.update('page', { is_publish: 1, publish_date, publish_url }, option));
    return result.affectedRows === 1;
  }
  async publishPageRender({ bodyHTML, page_title, user_id, page_url }) {
    const absoluteDirUrl = path.resolve(__dirname, `../public/pages/${user_id}`);
    const absolutePageUrl = path.resolve(__dirname, `../public/pages/${user_id}/${page_url}.html`);
    const absoluteTemplateUrl = path.resolve(__dirname, '../view/myPage.hbs');

    const dirExist = fs.existsSync(absoluteDirUrl);
    if (!dirExist) {
      fs.mkdirSync(absoluteDirUrl);
    }

    const template = fs.readFileSync(absoluteTemplateUrl).toString();
    const HTML = template.replace('{{body}}', bodyHTML).replace('{{page_title}}', page_title);
    fs.writeFileSync(absolutePageUrl, HTML);
  }
}

module.exports = HomeService;
