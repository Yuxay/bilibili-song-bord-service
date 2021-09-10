const router = require('koa-router')();

const ChargeController = require('../controller/song_controller');
router.get('/', async (ctx) => {
  ctx.body = '<h2>测试</h2>';
});

router.post('/charge/start/v1.0', ChargeController.createCharge); // 开始充电
router.post('/charge/stop/v1.0', ChargeController.stopCharge); // 结束充电
router.post('/charge/cancel/v1.0', ChargeController.cancelCharge); // 取消充电
router.get('/charge/:chargeId/v1.0', ChargeController.getChargeInfo); // 通过chargeId获取充电信息

module.exports = router;
