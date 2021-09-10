const utils = require('../utils');
const ConfigService = require('../service/config_service');
const axios = require('axios');
const instance = axios.create({
  // baseURL: 'https://test.ccharger.com.cn/ccharger/',
  baseURL: 'http://192.168.1.107:8082/',
  // baseURL: 'http://127.0.0.1:8082/',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

global.intervalMap = new Map(); // 存放每条充电信息的map对象

var interval = null; // 定时器

module.exports = {
  /** 新增直播间配置 */
  createConfig: async (ctx, next) => {
    let configInfo = ctx.request.body;
    await ConfigService.createSongService(configInfo)
      .then((result) => {
        ctx.body = {
          code: 0,
          msg: 'success',
        };
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          msg: err.message,
        };
      });
  },
  /** 获取直播间配置 */
  getConfigInfo: async (ctx, next) => {
    let selectKey = ctx.request.body;
    await ConfigService.getSongListFilter(selectKey)
      .then((data) => {
        ctx.body = {
          code: 0,
          msg: 'success',
          data: data,
        };
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          msg: err.message,
        };
      });
  },
  /** 修改直播间配置 */
  updateConfigInfo: async (ctx, next) => {
    let configInfo = ctx.request.body;
    
  },
};

func;
