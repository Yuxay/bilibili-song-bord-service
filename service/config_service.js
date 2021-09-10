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
    filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['roomId'] = filterObj.roomId) : selectObj;
    return Config.findOne({
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
