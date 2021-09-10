const { Song } = require('../model/song_model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const utils = require('../utils');

class ChargeService {
  /** 创建充电信息 */
  async createSongService(songInfo) {
    return Song.create(songInfo);
  }
  /** 获取点歌信息 */
  async getSongListFilter(filterObj) {
    let selectObj = { deleted: 1 };
    filterObj.time && !utils.isEmpty(filterObj.time) ? (selectObj['time'] = filterObj.time) : selectObj;
    filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['roomId'] = filterObj.roomId) : selectObj;
    return Song.findAll({
      order: [['createdAt', 'DESC']],
      where: selectObj,
    });
  }

  /** 修改点歌信息 */
  async updateSongService(id, songInfo) {
    return Song.update(songInfo, { where: { id: id } });
  }
}

module.exports = new ChargeService();
