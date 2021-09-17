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
// app.use(cors());
app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      return '*';
      // if (ctx.url === '/test') {
      //   return '*'; // 允许来自所有域名请求
      // }
      // return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], //设置获取其他自定义字段
  })
);

const toHump = require('./utils/toHump');
app.use(toHump); // 需要放在引用路由之前
const router = require('./routes');
app.use(bodyParser());

app.use(router.routes());

app.use(async (ctx, next) => {
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
