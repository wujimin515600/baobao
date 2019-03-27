//获取应用实例
const app = getApp();
import user from "../../utils/user";
import http from "../../utils/http";
import dialog from "../../utils/dialog";
import {
  domain,
  iconUrl
}
from '../../global.js'
var fivetimer;
var finshtimers;
// import tiems from '../../utils/time'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    seektype: false,
    sitetype: "index",
    reasonListData: [],
    rangId: "",
    orderId: "",
    cancalType: false,
    desc: "",
    exist: false,
    countDownNum: 0,
    cancleShowType: false,
    ldata: false,
    userinfo: {},
    o_state: null,
    rs_name: '',
    callPhpne: null,
    oid: '',
    cate_list: [],
    imgurl: iconUrl,
    actInvite: false,
    // 通用遮罩层
    showCover: false,
    showEvaluate: false,
    // 评论标签
    rateLabels: [],
    rateRankList: [
      "您的评价会让我们做得更好",
      "非常不满意，各方面都很差",
      "不满意",
      "一般，需要改善",
      "比较满意，仍需改善",
      "非常满意"
    ],
    rateRank: 0,
    rateId: false,
    // 是否匹配倒计时中
    isMatching: false
  },
  onLoad(e) {
    if (e.rateId) {
      this.setData({
        rateId: e.rateId
      })
      this.setEvaluate(true)
    }
    // if (app.fristBoot) {
    //   this.setInvite(true)
    //   app.fristBoot = false
    // }
    this.getRateLabel()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;


    that.setData({
      userinfo: user.info()
    });

    that.indexList = that.selectComponent("#indexList");
    that.indexList.refreshClcik();

    if (that.data.seektype == false) {
      that.setBackground();
    }
    if (that.data.userinfo) {
      // 默认请求收货未完成接口
      that.uncomple();
    }
    this.categData()
  },
  getRateLabel() {
    app.http.get('order/c/rate/label/', {
      success: res => {
        this.setData({
          rateLabels: res.labels
        })
      }
    })
  },
  onClickRateRank(e) {
    let index = e.target.dataset.index
    this.setData({
      rateRank: index
    })
  },
  onCloseRate() {
    this.setEvaluate(false)
  },
  onClickRateLabel(e) {
    let index = e.target.dataset.index

    this.setData({
      [`rateLabels[${index}].act`]: !this.data.rateLabels[index].act
    })
  },
  closeActInvite() {
    this.setInvite(false)
  },
  goToInviteACT() {
    this.setInvite(false)
    wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
      url: "/pages/ACT-invite/ACT-invite"
    })
  },
  setEvaluate(b) {
    this.setData({
      showEvaluate: b,
      showCover: b
    })
  },
  // 提交评价
  rateSubmit() {
    if (!this.data.rateRank) {
      wx.showToast({
        title: '请选择评价等级',
        icon: 'none'
      })
      return false
    }

    let label_ids = []
    this.data.rateLabels.forEach((e, i) => {
      e.act && (label_ids.push(e.id))
    });
    let data = {
      rank: this.data.rateRank,
      comments: "",
      label_ids,
      "order": this.data.rateId,
    }
    // console.log(data);

    app.http.post('order/c/rate/', {
      needLogin: true,
      data: {
        data
      },
      success: res => {
        wx.showToast({
          title: '评价成功',
          icon: 'none'
        })
        this.setEvaluate(false)
      }
    })
  },
  setInvite(b) {
    this.setData({
      actInvite: b,
      showCover: b
    })
  },
  setBackground: function () {
    wx.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#FFFFFF",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      that.indexList.refreshClcik();
      if (that.data.userinfo) {
        that.uncomple();
      }
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1500);
  },
  toggleToast(e) {
    if (e.detail) {
      app.getPermission(this, () => {
        wx.chooseLocation({
          success: function (res) {
            obj.setData({
              addr: res.address
            });
            callback();
          }
        });
      });
    }
  },
  // 品类数据
  categData() {
    let that = this
    let user = that.data.userinfo.user_sid;
    http.get('indexCateg', {
      data: {
        user_sid: user,
        operator: 0
      },
      success: res => {
        that.setData({
          cate_list: res.categories
        })
      },
      fail: res => {
        dialog.tips(res.result);
      }
    })
  },
  cateClick(e) {
    wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
      url: "/pages/realPrice/realPrice?id=" + e.currentTarget.dataset.id
    })
  },
  // 获取客户未完成订单
  uncomple() {
    var that = this;
    let user = that.data.userinfo.user_sid;
    http.get("uncompleted", {
      showLoading: false,
      data: {
        user_sid: user
      },
      success: res => {
        that.setData({
          orderId: res.uncompleted.id ? res.uncompleted.id : "",
          exist: res.exist,
          countDownNum: res.uncompleted.time_remain ?
            res.uncompleted.time_remain : 0,
          o_state: res.uncompleted.o_state,
          // oid: res.uncompleted.id
        });
        if (res.uncompleted.recycling_staff) {
          that.setData({
            rs_name: res.uncompleted.recycling_staff.rs_name ? res.uncompleted.recycling_staff.rs_name : '',
            callPhpne: res.uncompleted.recycling_staff.rs_pn ? res.uncompleted.recycling_staff.rs_pn : ''
          })
        }

        that.daojs();

        if (res.uncompleted.o_state == 0 && !that.data.isMatching) {
          that.count();
        }
        // if (res.uncompleted.o_state == 3) {
        //   var url = "/pages/order/goodsfinish/goodsfinish";
        //   wx.navigateTo({
        //     url: url
        //   });
        // }
      }
    });
  },
  // 倒计时
  count() {
    var that = this;
    let time = that.data.countDownNum;
    const countDown = second => {
      const s = second % 60;
      const m = Math.floor(second / 60);
      return `${`00${m}`.slice(-2)} : ${`00${s}`.slice(-2)}`;
    };
    const timer = setInterval(() => {
      this.setData({
        isMatching: true
      })
      that.setData({
        countDownNum: countDown(time--)
      });
      if (time < 0) {
        this.setData({
          isMatching: false
        })
        clearInterval(timer);
        that.uncomple();
      }
    }, 1000);
  },

  // 取消订单理由列表
  orderBy() {
    var that = this;
    http.get("reasonList", {
      data: {},
      success: res => {
        var data = res.reasons;
        for (let i = 0; i < data.length; i++) {
          data[i].checked = false;
        }
        that.setData({
          reasonListData: data,
          cancalType: true
        });
      }
    });
  },
  radioChange(e) {
    var that = this;
    that.setData({
      rangId: e.detail.value
    });
  },
  inputother(e) {
    var that = this;
    that.setData({
      desc: e.detail.value
    });
  },

  // 取消订单
  cancelOrders() {
    var that = this;
    let user = that.data.userinfo.user_sid;
    if (that.data.rangId != "" || that.data.desc != "") {
      http.post("cancelOrder", {
        data: {
          data: {
            user_sid: user,
            reason: that.data.rangId,
            order: that.data.orderId,
            desc: that.data.desc
          }
        },
        success: res => {
          that.setData({
            cancalType: false,
            cancleShowType: true
          });
          that.uncomple();
          setTimeout(function () {
            that.setData({
              cancleShowType: false
            });
          }, 1500);
        },
        fail: res => {
          dialog.tips(res.result);
          setTimeout(function () {
            that.cancal();
          }, 1500);
        }
      });
    } else {
      dialog.tips("请填写理由");
    }
  },
  // 订单失败确认
  confirmButton() {
    var that = this;
    that.setData({
      cancleShowType: true,
      exist: false
    });
    setTimeout(function () {
      that.setData({
        cancleShowType: false
      });
    }, 1500);
  },
  // 取消
  cancal() {
    var that = this;
    that.setData({
      cancalType: false
    });
  },
  // 打电话
  callTel() {
    var that = this;
    if (that.data.callPhpne != null) {
      wx.makePhoneCall({
        phoneNumber: that.data.callPhpne //仅为示例，并非真实的电话号码
      });
    } else {
      wx.makePhoneCall({
        phoneNumber: "0411-62623999" //仅为示例，并非真实的电话号码
      });
    }
  },
  goCent() {
    wx.navigateTo({
      url: "/pages/userCenter/center/center"
    });
  },
  zhibc() {
    var that = this;
    that.setData({
      cancalType: false,
      cancleShowType: false
    });
  },
  // 获取订单（收货完成）
  orderFinsh() {
    var that = this;
    let user = that.data.userinfo.user_sid;

    if (!that.data.orderId) {
      return false
    }

    http.get("finsh", {
      showLoading: false,
      data: {
        user_sid: user,
        oid: that.data.orderId
      },
      success: res => {
        that.setData({
          o_state: res.order_info.o_state
        });
        // if (
        //   res.order_info.o_state != 0 ||
        //   res.order_info.o_state != 2 ||
        //   res.order_info.o_state == null
        // ) {
        //   clearInterval(fivetimer);
        //   return false
        // }

        if (res.order_info.o_state == 3) {
          clearInterval(finshtimers);
          // 遍历黑名单
          for (const v in app.homeOrderBlacklist) {
            console.log(v, that.data.orderId);

            if (app.homeOrderBlacklist[v] == that.data.orderId) {
              console.log('in');
              return false
            }
          }

          // 跳转前加入黑名单
          app.homeOrderBlacklist.push(that.data.orderId)

          this.navToFinish()
        }
      },
      fail: res => {
        dialog.tips(res.result);
        // clearInterval(timers)
      }
    });
  },
  navToFinish() {
    var url = "/pages/order/goodsfinish/goodsfinish?id=" + this.data.orderId;

    wx.reLaunch({
      url
    })
  },
  daojs() {
    var that = this;

    // if (that.data.o_state == 0) {
    //   fivetimer = setInterval(() => {
    //     that.orderFinsh();
    //   }, 1000 * 15);
    // }

    // if (that.data.o_state == 3) {
    finshtimers = setInterval(() => {
      that.orderFinsh();
    }, 1000 * 15);
    // }
  }
});