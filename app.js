// app.js
const Koa = require('koa');
const app = new Koa();

// 引入https 以及 koa-ssl
const https = require('https');
const sslify = require('koa-sslify').default;
app.use(sslify()); // 使用ssl
const fs = require('fs');

const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
app.use(cors());

const toHump = require('./utils/toHump');
app.use(toHump); // 需要放在引用路由之前
const router = require('./routes');
app.use(bodyParser());

app.use(router.routes());


app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
});

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

// 路径为证书放置的位置

const options = {
  key: fs.readFileSync('./www.yuxay.cn.key'), //私钥文件路径
  cert: fs.readFileSync('./www.yuxay.cn.pem'), //证书文件路径
};

// config.port为自定义端口

https.createServer(options, app.callback()).listen(3001, (err) => {
  if (err) {
    console.log('服务启动出错', err);
  } else {
    console.log('Server is running in 3001!');
  }
});

// app.listen(3001, () => {
//   console.log('Server is running!');
// });
