function formatTime(date) {
    var date = new Date(date)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
// 经纬度长度处理   截取10位
function conversion(n) {
  if (typeof (n) === 'number') n = n.toString()
  let arr = n.split('.')
  let flt, str;
  let length = 9;
  str = n
  if (arr.length > 1) {
    flt = arr[1].substring(0, length - arr[0].length)
    str = arr[0] + '.' + flt
  }
  return str;
}
module.exports = {
    formatTime: formatTime,
  conversion: conversion
}