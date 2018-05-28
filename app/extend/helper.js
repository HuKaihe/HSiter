'use strict';

const http = require('http');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../../config/.config.js');

function getRandomString() {
  return Math.random().toString(36).substr(2) + new Date().getTime();
}

const mailSender = nodemailer.createTransport(smtpTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
const sendMail = function(recipient, subject, html) {
  mailSender.sendMail({
    from: config.email.user,
    to: recipient,
    subject,
    html,
  }, function(error) {
    if (error) {
      console.log('发送失败');
      return;
    }
    console.log('发送成功');
  });
};

function getClientIp(req) {
  let ip =
    req.headers['X-Real-IP'] ||
    req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
}

const getIpInfo = function(req, cb) {
  const ip = getClientIp(req);
  const sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
  const url = sina_server + ip;
  http.get(url, function(res) {
    const code = res.statusCode;
    if (code === 200) {
      res.on('data', function(data) {
        try {
          cb(null, ip, JSON.parse(data));
        } catch (err) {
          cb(err);
        }
      });
    } else {
      cb({ code });
    }
  }).on('error', function(e) { cb(e); });
};

module.exports = { sendMail, getIpInfo, getRandomString };
