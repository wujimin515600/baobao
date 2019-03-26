import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import unfold from '../../../utils/unfold'
import numberUtil from '../../../utils/tofixed'
import {
    domain,
    iconUrl
}
from '../../../global.js'
Page({
    data: {
        choose: false,
        listchoose: false,
        stopBtn: true,
        stopBtns: true,
        animationData: {},
        animationDatass: {},
        zhebiType: false,
        deliveryData: [],
        page: 0,
        listData: [],
        totalMoney: 0,
        moreData: [],
        summeryData: [],
        boxHeight: 450,
        userinfo: {}
    },
    onShow() {
        this.setData({
            userinfo: user.info()
        })
        this.moreData()
        this.delivery()
        this.deliveryListdata()
    },
    unfolddown() {
        var that = this
        if (that.data.moreData.length > 0) {
            unfold.showContent(that, "choose", 'animationData')
            that.setData({
                zhebiType: true
            })
        }
    },
    unfoldup() {
        unfold.hideContent(this, 'choose', 'animationData')
        this.setData({
            zhebiType: false
        })
    },
    kindToggle(e) {
        const id = e.currentTarget.id
        const list = this.data.listData
        for (let i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].type = !list[i].type
            } else {
                list[i].type = false
            }
        }
        this.setData({
            listData: list
        })
    },

    // 获取接口数据
    delivery() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('overview', {
            data: {
                user_sid: user,
            },
            success: (res) => {
                that.setData({
                    deliveryData: res,
                    totalMoney: res.total_amount.toFixed(2)
                })
            },
            fail: (res) => {
                dialog.tips(res.result)
            }
        })

    },


    deliveryListdata() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('overviewList', {
            data: {
                user_sid: user,
                page: that.data.page
            },
            success: (res) => {
                if (res.orders) {
                    var str = res.orders
                    for (let index = 0; index < str.length; index++) {
                        str[index].type = false
                        str[index].detail = []
                        that.orderDetail(str[index].id)
                    }
                    that.setData({
                        listData: str
                    })
                }
            },
            fail: (res) => {
                dialog.tips(res.result)
            }
        })
    },
    // 查看更多
    moreData() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('summary', {
            data: {
                user_sid: user
            },
            success: res => {
                let data = res.summary
                for (let i = 0; i < data.length; i++) {
                    data[i].icon = iconUrl + data[i].tid
                }
                that.setData({
                    moreData: data,
                    boxHeight: data ? '450' : 0
                })
            },
            fail: (res) => {
                dialog.tips(res.result)
            }
        })
    },
    orderDetail(id) {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('summaryDetail', {
            data: {
                user_sid: user,
                oid: id
            },
            success: res => {
                let newdata = that.data.listData
                let allmoney = 0
                for (let index = 0; index < res.details.length; index++) {
                    allmoney += res.details[index].total_price
                }
                for (let index = 0; index < newdata.length; index++) {
                    newdata[index].detail = res.details
                    newdata[index].all_price = allmoney
                }
                that.setData({
                    listData: newdata
                })
                console.log(that.data.listData)
            },
            fail: (res) => {
                dialog.tips(res.result)
            }
        })
    }
})