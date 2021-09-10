const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.site.database, config.site.username, config.site.password, {
  host: config.site.host,
  port: config.site.port,
  dialect: config.site.dialect,
  pool: {
    // 连接池设置
    max: 5, // 最大连接数
    min: 0, // 最小连接数
    idle: 10000,
  },
});

module.exports = sequelize;
