// pages/ACT-invite/ACT-invite.js

let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: false,
    list: [],
    shareVisable: false
  },
  onShareAppMessage(res) {
    return {
      title: '赶快加入保保回收，一起为公益助力吧！',
      path: '/pages/user/activeregister/activeregister?share_referrer_code=' + this.data.code,
      imageUrl: "https://b.bbrecycle.cn/static_banners/share/share-link.jpeg"
    }
  },
  onLoad: function (options) {
    app.http.get("share1vn_event/referrer", {
      needLogin: true,
      success: res => {
        this.getList();
        this.setData({
          code: res.code
        });
      }
    });
  },
  getList() {
    app.http.get("share1vn_event/referrer/referee/list", {
      needLogin: true,
      success: res => {
        this.setData({
          list: res.shares
        });
      }
    });
  },
  cancelShare() {
    this.setData({
      shareVisable: false
    });
  },
  openShare() {
    this.setData({
      shareVisable: true
    });
  },
  shareWithFriends() {
    wx.showToast({
      title: "功能尚未开放",
      icon: "none"
    });
  },
});