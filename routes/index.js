const router = require('koa-router')();

const SongController = require('../controller/song_controller');
const ConfigController = require('../controller/config_controller');
router.get('/', async (ctx) => {
  ctx.body = '<h2>测试</h2>';
});

// 点歌相关接口
router.post('/room/song/select', SongController.getSongList);
router.post('/room/song/create', SongController.createSong);
router.post('/room/song/update', SongController.updateSong);

// 房间配置相关接口
router.get('/room/config/select', ConfigController.getConfigInfo);
router.post('/room/config/create', ConfigController.createConfig);
router.post('/room/config/update', ConfigController.updateConfigInfo);

module.exports = router;
