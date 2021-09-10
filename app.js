const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const router = require('./routes');
const app = new Koa();
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

app.listen(3000, () => {
  console.log('Server is running!');
});
