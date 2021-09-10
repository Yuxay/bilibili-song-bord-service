const Sequelize = require('sequelize');
const sequelize = require('../db/conn_base');

// 设备表
const Config = sequelize.define(
  'room_config',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    deleted: {
      // 0:被删除，1:未被删除
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    user_cd: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    song_cd: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    max_num: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    room_id: { type: Sequelize.STRING, allowNull: false },
  },
  {
    freezeTableName: true, // 默认为false，true使用自定义的表名，不自动添加 "s"
    timestamps: true, // 默认为true， false禁止创建createdAt，updateAt 字段
    // createdAt: "createTime", // 创建updateTimestamp字段来代替createdAt 字段。
    // updatedAt: "update_time", // 创建updateTimestamp字段来代替updateAt 字段。
  }
);

// 单表同步
Config.sync({ force: false });
// Config.sync({ force: true }); // 强制同步，当数据库中已存在表时，先删除表后创建。

module.exports = { Config };
