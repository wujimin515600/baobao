import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import {
    matserStu
} from '../../../global.js'

const app = getApp();
Page({
    data: {
        phone: null,
        deliveryNum: 0,
        realname: '',
        total_amount: 0,
        user: {},
        stationmaster_type: 1,
        matserStu,
        name: '',
        r_code: ''
    },
    onShow() {
        this.setData({
            user: user.info()
        })
        this.userInfo()
        this.masterStatus()

    },
    pool() {
        console.log(1);

    },
    userInfo() {
        var that = this
        let user = that.data.user.user_sid
        http.get('center', {
            data: {
                user_sid: user,
            },
            success: res => {
                var tels = that.phone(res.user_info.pn)
                that.setData({
                    phone: tels,
                    realname: res.is_validate,
                    deliveryNum: res.n_times,
                    total_amount: res.total_amount
                })
            }
        })
    },
    // 获取累计投递
    delivery() {
        var that = this
        let user = that.data.user.user_sid
        http.get('overview', {
            data: {
                user_sid: user,
            },
            success: res => {
                that.setData({
                    deliveryNum: res.n_times
                })
            }
        })
    },
    phone(tels) {
        var tel = tels;
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        tel = tel.replace(reg, "$1****$2");
        return tel
    },

    clickInfor() {
        var that = this
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/userCenter/information/information?phone=" + that.data.phone + '&realname' + that.data.realname
        })

    },
    hrefSet() {
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/userCenter/set/set"
        })
    },
    // 站长申请
    apply() {
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/stationmaster/apply/apply"
        })
    },
    // 站长查看营业额
    turnover() {
        var that = this
        if (that.data.matserStu == 1) {
            wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
                url: "/pages/stationmaster/manage/manage?name=" + that.data.name + '&r_code=' + that.data.r_code
            })
        }
    },
    call() {
        wx.makePhoneCall({
            phoneNumber: '0411-62623999' //仅为示例，并非真实的电话号码
        })
    },
    deliveryClcik() {
        wx.navigateTo({
            url: '/pages/userCenter/delivery/delivery'
        })
    },
    // 获取站长申请状态
    masterStatus() {
        var that = this
        let user = that.data.user.user_sid
        http.get('referrer', {
            data: {
                user_sid: user,
            },
            success: res => {
                wx.setStorage({
                    key: 'referrerInfo',
                    data: res
                })

                that.setData({
                    stationmaster_type: 2,
                    matserStu: res.r_state,
                    name: res.name ? res.name : '',
                    r_code: res.referrer_code
                })
                wx.set
            },
            fail: res => {
                if (res.result == '419') {
                    that.setData({
                        stationmaster_type: 1
                    })
                } else {
                    dialog.tips(res.result)
                }
            }
        })
    },
})