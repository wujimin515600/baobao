import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
Page({
    data: {
        info: {},
        friendship_tips: [
            '推广链接： 点击分享-发送给微信客户-客户注册成功-客户每投一笔则自身收到一定比例提成； ',
            '推广二维码： 点击打开-客户微信扫码-客户注册成功-客户每投一笔则自身收到一定比例提成。 '
        ],
        userinfo: {},
        name: '',
        r_code: ''

    },
    onLoad(e) {
        console.log(e)
        this.setData({
            name: e.name,
            r_code: e.r_code
        })
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.prom()
    },

    // 站长营业额
    prom() {
        let that = this
        let user = that.data.userinfo.user_sid
        http.get('promSummary', {
            data: {
                user_sid: user
            },
            success: res => {
                that.setData({
                    'info.money': res.total_business_price,
                    'info.people': res.count_client,
                    'info.royalty': res.total_promotion
                })
            },
            fail: res => {
                dialog.tips(res.result);
            }
        })
    },
    // 客户汇总跳转
    pool() {
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/stationmaster/pool-summary/pool-summary"
        })
    },
    // 分享跳转
    share_button() {
        let that = this
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/stationmaster/manage-share/manage-share?name=" + that.data.name + '&r_code=' + that.data.r_code
        })
    },
    // 推广跳转
    spread_button() {
        let that = this
        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
            url: "/pages/stationmaster/manage-qrcode/manage-qrcode?name=" + that.data.name + '&r_code=' + that.data.r_code
        })
    },
})