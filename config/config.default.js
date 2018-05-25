'use strict';
const { mysql } = require('./.config');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1520409811913_9278';

  config.view = {
    defaultViewEngine: 'handlebars',
    mapping: {
      '.hbs': 'handlebars',
    },
  };

  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000 * 30, // 30 天
    httpOnly: true,
    encrypt: true,
    overwrite: true,
  };

  config.cookie = {
    overwrite: true,
  };

  config.security = {
    csrf: {
      ignoreJSON: true,
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    },
    methodnoallow: {
      enable: false,
    },
    domainWhiteList: [ 'localhost:8080' ],
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: mysql.host,
      // 端口号
      port: mysql.port,
      // 用户名
      user: mysql.user,
      // 密码
      password: mysql.password,
      // 数据库名
      database: mysql.database,
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  return config;
};
