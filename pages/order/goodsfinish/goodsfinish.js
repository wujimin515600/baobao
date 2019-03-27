import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import {
    domain,
    iconUrl
}
from '../../../global.js'
Page({
    data: {
        list: [],
        total_money: 0,
        showMore: false,
        userinfo: {},
        oid: ''
    },
    onLoad(e) {
        this.setData({
            oid: e.id
        })
    },
    onShow() {
        this.setData({
            userinfo: user.info()
        })
        // this.moreData()
        this.finshsdata()
    },
    // 查看更多
    // moreData() {
    //     var that = this
    //     let user = that.data.userinfo.user_sid
    //     http.get('summary', {
    //         data: {
    //             user_sid: user
    //         },
    //         success: res => {
    //             let data = res.summary
    //             let money = 0
    //             for (let i = 0; i < data.length; i++) {
    //                 data[i].icon = iconUrl + data[i].tid
    //                 money += data[i].price
    //             }
    //             that.setData({
    //                 list: data,
    //                 total_money: money
    //             })
    //         },
    //         fail: res => {
    //             dialog.tips(res.result)
    //         }
    //     })

    // },
    showMore() {
        this.setData({
            showMore: true
        })
    },
    finshsdata() {
        var that = this
        http.get('finsh', {
            data: {
                oid: that.data.oid
            },
            needLogin: true,
            success: res => {
                console.log(res)
                let data = res.order_info
                for (let i = 0; i < data.details.length; i++) {
                    data.details[i].icon = iconUrl + data.details[i].toptype_c
                }
                that.setData({
                    list: data.details,
                    total_money: data.amount
                })
            }
        })
    },
    finshButton() {
        wx.redirectTo({
            url: '/pages/home/home?rateId=' + this.data.oid
        })
    }
})