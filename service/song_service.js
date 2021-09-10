const { Song } = require('../model/song_model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const utils = require('../utils');

class ChargeService {
  /** 创建点歌信息 */
  async createSongService(songInfo) {
    return Song.create(songInfo);
  }
  /** 获取点歌信息 */
  async getSongListFilter(filterObj) {
    let selectObj = { deleted: 1 };
    filterObj.chooseTime && !utils.isEmpty(filterObj.chooseTime) ? (selectObj['choose_time'] = { [Op.gte]: filterObj.chooseTime }) : (selectObj = selectObj);
    // filterObj.chooseTime && !utils.isEmpty(filterObj.chooseTime) ? (selectObj['choose_time'] = filterObj.chooseTime) : selectObj;
    filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['room_id'] = filterObj.roomId) : selectObj;
    filterObj.uid && !utils.isEmpty(filterObj.uid) ? (selectObj['uid'] = filterObj.uid) : selectObj;
    filterObj.songTitle && !utils.isEmpty(filterObj.songTitle) ? (selectObj['song_title'] = filterObj.songTitle) : selectObj;
    console.log('selectObj: ', selectObj);
    return Song.findAll({
      order: [['createdAt', 'DESC']],
      where: selectObj,
      raw: true,
    });
  }

  /** 修改点歌信息 */
  async updateSongService(id, songInfo) {
    return Song.update(songInfo, { where: { id: id } });
  }
}

module.exports = new ChargeService();
