const utils = {
  isEmpty(val) {
    let valType = Object.prototype.toString.call(val);
    let isEmpty = false;
    if (valType === '[object Undefined]' || valType == '[object Null]') {
      isEmpty = true;
    } else if (valType === '[object Array]' || valType === '[object String]') {
      isEmpty = val.length <= 0 || val + '' === 'undefined' || val + '' === 'null' ? true : false;
    } else if (valType == '[object Object]') {
      try {
        let temp = JSON.stringify(val);
        if (temp == '{}') {
          isEmpty = true;
        } else {
          isEmpty = false;
        }
      } catch (error) {
        isEmpty = false;
      }
    }
    return isEmpty;
  },
  getElementType(ele) {
    let valType = Object.prototype.toString.call(ele);
    return valType;
  },
  /**
   * 乘法
   * @param {number} arg1 第一个数
   * @param {number} arg2 第二个数
   * @returns 计算结果
   */
  MulFun(arg1, arg2) {
    var m = 0;
    var s1 = arg1.toString();
    var s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}

    let end = (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
    let res = !utils.isEmpty(end) ? parseFloat(end) : 0;
    return res;
  },
  /**
   * 除法
   * @param {number} a 第一个数
   * @param {number} b 第二个数
   * @returns 计算结果
   */
  DivFun(a, b) {
    var c,
      d,
      e = 0,
      f = 0;
    try {
      e = (a || 0).toString().split('.')[1].length;
    } catch (g) {}
    try {
      f = (b || 0).toString().split('.')[1].length;
    } catch (g) {}
    return (c = Number(a.toString().replace('.', ''))), (d = Number(b.toString().replace('.', ''))), cont_mul(c / d, Math.pow(10, f - e));

    function cont_mul(a, b) {
      var c = 0,
        d = (a || 0).toString(),
        e = (b || 0).toString();
      try {
        c += d.split('.')[1].length;
      } catch (f) {}
      try {
        c += e.split('.')[1].length;
      } catch (f) {}
      let end = (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
      let res = !utils.isEmpty(end) ? parseFloat(end) : 0;
      return res;
    }
  },
  /**
   * 减法
   * @param {number} arg1 第一个数
   * @param {number} arg2 第二个数
   * @returns 计算结果
   */
  SubFun(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    let end = ((arg1 * m - arg2 * m) / m).toFixed(n);
    let res = !utils.isEmpty(end) ? parseFloat(end) : 0;
    return res;
  },

  /**
   * 加法
   * @param {number} arg1 第一个数
   * @param {number} arg2 第二个数
   * @returns 计算结果
   */
  AddFun(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    let end = ((arg1 * m + arg2 * m) / m).toFixed(n);
    let res = !utils.isEmpty(end) ? parseFloat(end) : 0;
    return res;
  },

  timeFun(unixtime, hasTime = true) {
    if (!unixtime) {
      return '/';
    }
    var dateTime = new Date(parseInt(unixtime));
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    if (hasTime) {
      unixtime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second);
    } else {
      unixtime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    }

    return unixtime;
  },

  guid() {
    let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(32);
    });
    let res = str.replace(/-/g, '');
    console.log(res);
    return res;
  },

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

module.exports = utils;
