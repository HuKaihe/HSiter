'use strict';

const Service = require('egg').Service;

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
  async updatePageSchema(page_id, page_schema, last_operate_time) {
    const row = { page_schema, last_operate_time };
    console.log(page_schema);
    const option = {
      where: {
        page_id,
      },
    };
    const result = (await this.app.mysql.update('page', row, option));
    console.log('result', result);
    return result.affectedRows === 1;
  }
}

module.exports = HomeService;
