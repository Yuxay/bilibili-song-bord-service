const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.base.database, config.base.username, config.base.password, {
  host: config.base.host,
  port: config.base.port,
  dialect: config.base.dialect,
  pool: {
    // 连接池设置
    max: 5, // 最大连接数
    min: 0, // 最小连接数
    idle: 10000,
  },
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
  timezone: '+08:00', //改为标准时区
});

module.exports = sequelize;
