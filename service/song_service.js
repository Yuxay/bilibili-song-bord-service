const { Song } = require('../model/song_model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const utils = require('../utils');
const axios = require('axios');
const instance = axios.create({
  baseURL: 'https://api.live.bilibili.com/',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

class ChargeService {
  /** 创建点歌信息 */
  async createSongService(songInfo) {
    return Song.create(songInfo);
  }
  /** 获取点歌信息 */
  async getSongListFilter(filterObj) {
    let selectObj = {};
    await getRoomLiveInfo(filterObj)
      .then((result) => {
        console.log('result: ', result);
        result && !utils.isEmpty(result) ? (selectObj['choose_time'] = { [Op.gte]: result }) : (selectObj = selectObj);
        filterObj.deleted && !utils.isEmpty(filterObj.deleted) ? (selectObj['deleted'] = filterObj.deleted) : (selectObj = selectObj);
        // filterObj.chooseTime && !utils.isEmpty(filterObj.chooseTime) ? (selectObj['choose_time'] = { [Op.gte]: filterObj.chooseTime }) : (selectObj = selectObj);
        filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['room_id'] = filterObj.roomId) : selectObj;
        filterObj.uid && !utils.isEmpty(filterObj.uid) ? (selectObj['uid'] = filterObj.uid) : selectObj;
        filterObj.songTitle && !utils.isEmpty(filterObj.songTitle) ? (selectObj['song_title'] = filterObj.songTitle) : selectObj;
      })
      .catch((err) => {
        filterObj.deleted && !utils.isEmpty(filterObj.deleted) ? (selectObj['deleted'] = filterObj.deleted) : (selectObj = selectObj);
        // filterObj.chooseTime && !utils.isEmpty(filterObj.chooseTime) ? (selectObj['choose_time'] = { [Op.gte]: filterObj.chooseTime }) : (selectObj = selectObj);
        filterObj.roomId && !utils.isEmpty(filterObj.roomId) ? (selectObj['room_id'] = filterObj.roomId) : selectObj;
        filterObj.uid && !utils.isEmpty(filterObj.uid) ? (selectObj['uid'] = filterObj.uid) : selectObj;
        filterObj.songTitle && !utils.isEmpty(filterObj.songTitle) ? (selectObj['song_title'] = filterObj.songTitle) : selectObj;
      });
    console.log('service层获取点歌信息请求参数: ', selectObj);
    return Song.findAll({
      // ASC: 升序  DESC: 降序
      order: [['createdAt', 'ASC']],
      where: selectObj,
      raw: true,
    });
  }

  /** 修改点歌信息 */
  async updateSongService(id, songInfo) {
    return Song.update(songInfo, { where: { id: id } });
  }
}

/** 获取直播间开播信息 */
async function getRoomLiveInfo(obj) {
  return await instance
    .get('/room/v1/Room/get_info?device=phone&;platform=ios&scale=3&build=10000&room_id=' + obj.roomId)
    .then(({ data }) => {
      if (data && data.code == 0) {
        console.log('live_time: ', data.data.live_time);
        let tempTime = data.data.live_time;
        return new Date(tempTime).getTime();
      } else {
        console.log('data: ', data);
      }
    })
    .catch((err) => {
      return 0;
      console.log('err: ', err);
    });
}

module.exports = new ChargeService();
