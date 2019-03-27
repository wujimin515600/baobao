// pages/userCenter/myPoints/myPoints.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },

  onLoad(o) {
    this.setData({
      value: o.value
    })
  },
  submit() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
  },
})