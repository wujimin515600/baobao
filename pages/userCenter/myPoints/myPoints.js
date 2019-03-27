// pages/userCenter/myPoints/myPoints.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: "0.00",
    balance_freezing: "0.00",
    dialogVisable: false,
    value: ''
  },

  onShow: function () {
    this.getData()
  },
  setAll() {
    this.setData({
      value: this.data.balance
    })
  },
  bindValue(e) {
    this.setData({
      value: e.detail.value
    })

  },
  getData() {
    app.http.get('wallet/balance/', {
      needLogin: true,
      success: res => {
        this.setData({
          balance_freezing: res.balance_freezing,
          balance: res.balance
        })
      }
    })
  },
  submit() {
    let value = Number(this.data.value)

    if (this.data.value <= 0) {

      wx.showToast({
        title: '提现金额需≥10.00',
        icon: 'none',
      });

      return false
    }
    // wx.navigateTo({
    //   url: "../applyResult/applyResult?value=" + this.data.value
    // })
    app.http.post('wallet/transaction/draw/', {
      needLogin: true,
      data: {
        data: {
          amount: this.data.value
        }
      },
      success: res => {
        wx.navigateTo({
          url: "../points-detail/points-detail?value=" + this.data.value
        })
      }
    })
  },
  hrefDetail() {
    wx.navigateTo({
      url: "../points-detail/points-detail"
    })
  },
  openDialog() {
    this.setData({
      dialogVisable: true
    })
  },
  closeDialog() {
    this.setData({
      dialogVisable: false
    })
  }
})