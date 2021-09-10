// 本地数据库配置
const localConfig = {
  base: {
    database: 'virtual_device',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
  },
  site: {
    database: 'charger',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
  },
};

// 线上数据库配置
const onlineConfig = {
  base: {
    database: 'virtual_device',
    username: 'root',
    password: '*ch`A;rger@)@!',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
  },
  site: {
    database: 'charger',
    username: 'root',
    password: '*ch`A;rger@)@!',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
  },
};

// module.exports = localConfig;
module.exports = onlineConfig;
