const Sequelize = require('sequelize');
const sequelize = require('../db/conn_base');

// 设备表
const Song = sequelize.define(
  'virtual_charge',
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
    },
    userCd: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    songCd: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    maxNum: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    roomId: { type: Sequelize.STRING, allowNull: true },
  },
  {
    freezeTableName: true, // 默认为false，true使用自定义的表名，不自动添加 "s"
    timestamps: true, // 默认为true， false禁止创建createAt，updateAt 字段
    // createdAt: "createTime", // 创建updateTimestamp字段来代替updateAt 字段。
    // updatedAt: "update_time", // 创建updateTimestamp字段来代替updateAt 字段。
  }
);

// 单表同步
Charge.sync({ force: false });
// Charge.sync({ force: true }); // 强制同步，当数据库中已存在表时，先删除表后创建。

module.exports = { Charge };
