const utils = require('../utils');
const SongService = require('../service/song_service');
const ConfigService = require('../service/config_service');
const axios = require('axios');
const instance = axios.create({
  baseURL: 'https://api.live.bilibili.com/',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

module.exports = {
  /** 新增点歌数据 */
  createSong: async (ctx, next) => {
    let songInfo = ctx.request.body;
    console.log('新增点歌请求参数: ', songInfo);
    let canUid = await judgeUid(songInfo);
    console.log('用户是否可点: ', canUid);
    let canSongTitle = await judgeSongTitle(songInfo);
    console.log('歌曲是否可点: ', canSongTitle);

    let addObj = {};
    addObj.song_title = !utils.isEmpty(songInfo.songTitle) ? songInfo.songTitle : null;
    addObj.username = !utils.isEmpty(songInfo.username) ? songInfo.username : null;
    addObj.uid = !utils.isEmpty(songInfo.uid) ? songInfo.uid : null;
    addObj.room_id = !utils.isEmpty(songInfo.roomId) ? songInfo.roomId : null;
    addObj.choose_time = !utils.isEmpty(songInfo.chooseTime) ? songInfo.chooseTime : null;
    if (canUid && canSongTitle) {
      await SongService.createSongService(addObj)
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
    } else if (canSongTitle) {
      ctx.body = {
        code: 500,
        msg: '您刚点过歌曲，暂无法继续点歌',
      };
    } else if (canUid) {
      ctx.body = {
        code: 500,
        msg: '这首歌已经被点过了哦',
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '您刚点过歌曲，暂无法继续点歌',
      };
    }
  },
  /** 获取点歌列表数据 */
  getSongList: async (ctx, next) => {
    let selectKey = ctx.request.body;
    console.log('点歌列表请求参数: ', selectKey);
    let roomId = selectKey.roomId;
    let chooseTime = getRoomLiveInfo(roomId);
    selectKey.chooseTime = chooseTime;
    await SongService.getSongListFilter(selectKey)
      .then((data) => {
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
  /** 修改点歌数据 */
  updateSong: async (ctx, next) => {
    let songInfo = ctx.request.body;
    console.log('修改点歌请求参数: ', songInfo);
    let id = songInfo.id;
    await SongService.updateSongService(id, songInfo)
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
  /** 删除点歌数据 */
  deleteSongItem: async (ctx, next) => {
    let id = ctx.request.body.id;
    let reqObj = { deleted: 0 };
    await SongService.updateSongService(id, reqObj)
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

/** 判断用户是否可以点歌 */
async function judgeUid(songInfo) {
  let roomId = songInfo.roomId;
  let uid = songInfo.uid;
  let nowChooseTime = songInfo.chooseTime;
  let canUid = false;
  let roomInfo = await getRoomConfig(songInfo);
  let userCd = roomInfo.user_cd;

  await SongService.getSongListFilter({ uid: uid, roomId: roomId })
    .then((result) => {
      if (utils.isEmpty(result)) {
        canUid = true;
      } else {
        let latestInfoArr = result.slice(-1);
        let latestInfo = latestInfoArr[0];
        let latestTime = latestInfo.choose_time;
        let timeDifference = utils.SubFun(nowChooseTime, latestTime);
        let resDifference = utils.DivFun(timeDifference, 60000);
        if (resDifference >= userCd) {
          canUid = true;
        } else {
          canUid = false;
        }
      }
    })
    .catch((err) => {
      canUid = false;
    });
  return canUid;
}

/** 判断歌曲是否已经被点过 */
async function judgeSongTitle(songInfo) {
  let roomId = songInfo.roomId;
  let songTitle = songInfo.songTitle;
  let canSongTitle = false;
  let roomInfo = await getRoomConfig(songInfo);
  let songCd = roomInfo.songCd;
  await SongService.getSongListFilter({ songTitle: songTitle, roomId: roomId })
    .then((result) => {
      if (utils.isEmpty(result)) {
        canSongTitle = true;
      } else {
        let latestInfo = result[0];
        let latestTime = latestInfo.choose_time;
        let timeDifference = utils.SubFun(nowChooseTime, latestTime);
        let resDifference = utils.DivFun(timeDifference, 3600000);
        if (resDifference >= songCd) {
          canSongTitle = true;
        } else {
          canSongTitle = false;
        }
      }
    })
    .catch((err) => {
      canSongTitle = false;
    });
  return canSongTitle;
}

/** 获取房间的配置信息 */
async function getRoomConfig(songInfo) {
  let filterObj = { roomId: songInfo.roomId };
  console.log('filterObj: ', filterObj);
  let resObj = {};
  await ConfigService.getConfigInfoService(filterObj)
    .then((result) => {
      resObj = { ...result };
    })
    .catch((err) => {
      resObj = {};
    });
  return resObj;
}

/** 获取直播间开播信息 */
function getRoomLiveInfo(roomId) {
  let liveTime = 0;
  instance
    .get('/room/v1/Room/get_info?device=phone&;platform=ios&scale=3&build=10000&room_id=' + roomId)
    .then(({ data }) => {
      console.log('data: ', data);
      if (data && data.code == 0) {
        liveTime = data.data.live_time;
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
  return liveTime;
}
