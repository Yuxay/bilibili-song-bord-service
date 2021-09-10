const utils = require('../utils');
const SongService = require('../service/song_service');
const ConfigService = require('../service/config_service');

module.exports = {
  /** 新增点歌数据 */
  createSong: async (ctx, next) => {
    let songInfo = ctx.request.body;

    let canUid = await judgeUid(songInfo);
    let canSongTitle = await judgeSongTitle(songInfo);
    console.log('canUid: ', canUid);
    console.log('canSongTitle: ', canSongTitle);
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
};

async function judgeUid(songInfo) {
  let roomId = songInfo.roomId;
  let uid = songInfo.uid;
  let nowChooseTime = songInfo.chooseTime;
  let canUid = false;
  let roomInfo = await getRoomConfig(songInfo);
  let userCd = roomInfo.userCd;
  console.log('roomInfo: ', roomInfo);
  await SongService.getSongListFilter({ uid: uid, roomId: roomId })
    .then((result) => {
      if (utils.isEmpty(result)) {
        canUid = true;
      } else {
        console.log('uidRes: ', result);
        let latestInfo = result[0];
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
        console.log('songTitleRes: ', result);
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

async function getRoomConfig(songInfo) {
  let filterObj = { room_id: songInfo.roomId };
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
