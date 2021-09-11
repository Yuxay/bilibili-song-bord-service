const { Config } = require('../model/config_model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const utils = require('../utils');

class ChargeService {
  /** 创建直播间配置 */
  async createConfigInfoService(songInfo) {
    return Config.create(songInfo);
  }
  /** 获取直播间配置 */
  async getConfigInfoService(filterObj) {
    let selectObj = { deleted: 1 };
    filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['room_id'] = filterObj.roomId) : selectObj;
    console.log('service层获取配置信息请求参数: ', selectObj);
    return Config.findOne({
      // ASC: 升序  DESC: 降序
      order: [['createdAt', 'DESC']],
      where: selectObj,
      raw: true,
    });
  }

  /** 修改直播间配置 */
  async updateConfigInfoService(id, songInfo) {
    return Config.update(songInfo, { where: { id: id } });
  }
}

module.exports = new ChargeService();
