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
/**
 * 截取经纬度的长度   总共10位（包括小数点）
 * params n {number} 传入值  经度或纬度  120.1212121212
 * return str {string} 返回值  120.121212
 * */ 
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