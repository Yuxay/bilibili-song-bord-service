const utils = require('../utils');
const SongService = require('../service/song_service');
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
  /** 新增点歌数据 */
  createSong: async (ctx, next) => {
    let songInfo = ctx.request.body;
    

    // await SongService.createSongService(songInfo)
    //   .then((result) => {
    //     ctx.body = {
    //       code: 0,
    //       msg: 'success',
    //     };
    //   })
    //   .catch((err) => {
    //     ctx.body = {
    //       code: 500,
    //       msg: err.message,
    //     };
    //   });
  },
  /** 获取点歌列表数据 */
  getSongList: async (ctx, next) => {
    let selectKey = ctx.request.body;
    await SongService.getSongListFilter(selectKey)
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
};

func
