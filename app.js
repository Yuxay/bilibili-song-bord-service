const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
// app.js
const toHump = require('./utils/toHump');
app.use(toHump); // 需要放在引用路由之前
const router = require('./routes');
app.use(bodyParser());

app.use(router.routes());

//错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || error.statusCode;
    ctx.body = {
      msg: error.message,
    };
  }
});

app.on('error', (err, ctx) => console.error('server error', err));

app.use(cors());

app.listen(3001, () => {
  console.log('Server is running!');
});
