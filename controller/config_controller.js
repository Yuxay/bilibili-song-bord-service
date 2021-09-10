const utils = require('../utils');
const ConfigService = require('../service/config_service');

module.exports = {
  /** 新增直播间配置 */
  createConfig: async (ctx, next) => {
    let configInfo = ctx.request.body;
    console.log('configInfo: ', configInfo);
    let addObj = {};
    addObj.user_cd = !utils.isEmpty(configInfo.userCd) ? configInfo.userCd : null;
    addObj.song_cd = !utils.isEmpty(configInfo.songCd) ? configInfo.songCd : null;
    addObj.max_num = !utils.isEmpty(configInfo.maxNum) ? configInfo.maxNum : null;
    addObj.room_id = !utils.isEmpty(configInfo.roomId) ? configInfo.roomId : null;
    console.log('addObj: ', addObj);
    const count = ConfigService.getConfigInfoService(configInfo.roomId);
    if (count > 0) {
      ctx.body = {
        code: 501,
        msg: '请勿重复创建直播间配置信息',
      };
    } else {
      await ConfigService.createConfigInfoService(addObj)
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
    }
  },
  /** 获取直播间配置 */
  getConfigInfo: async (ctx, next) => {
    let selectKey = ctx.request.body;
    await ConfigService.getConfigInfoService(selectKey)
      .then((data) => {
        console.log('data: ', data);
        ctx.write({
          code: 0,
          msg: 'success',
          data: data,
        });
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
    console.log('configInfo: ', configInfo);
    let id = configInfo.id;
    let updateObj = {};
    updateObj.user_cd = !utils.isEmpty(configInfo.userCd) ? configInfo.userCd : 0;
    updateObj.song_cd = !utils.isEmpty(configInfo.songCd) ? configInfo.songCd : 0;
    updateObj.max_num = !utils.isEmpty(configInfo.maxNum) ? configInfo.maxNum : 0;
    updateObj.room_id = !utils.isEmpty(configInfo.roomId) ? configInfo.roomId : 0;
    await ConfigService.updateConfigInfoService(id, updateObj)
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
};
