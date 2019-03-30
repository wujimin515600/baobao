import dialog from '../../utils/dialog'
import user from '../../utils/user'
import http from '../../utils/http'
import {
    domain,
    iconUrl
}
from '../../global.js'
Page({
    data: {
        userinfo: {},
        priceList: [],
        price_topName: [],
        search_data: [],
        home_set_id: '',
        img_index: 1,
        imgurl: iconUrl
    },
    onLoad(e) {
        this.setData({
            home_set_id: e.id
        })
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.real()
    },
    real() {
        let that = this
        let user = that.data.userinfo.user_sid
        http.get('categ', {
            data: {
                user_sid: user,
                operator: 0
            },
            success: res => {
                let topname = res.categories
                topname = topname.map((item) => {
                    return {
                        name: item.t_top_name,
                        id: item.id,
                        isactive: false
                    }
                })
                that.setData({
                    price_topName: topname,
                    priceList: res.categories
                })
                that.clickReal()
            },
            fail: res => {
                dialog.tips(res.result);
            }
        })
    },
    clickReal(e) {
        let that = this
        let id = e ? e.currentTarget.dataset.id : that.data.home_set_id
        let data = that.data.priceList
        let new_data = []
        let isactive = ''
        let topnav = that.data.price_topName
        for (let index = 0; index < data.length; index++) {
            if (id == data[index].id) {
                data[index].isactive = true
                // new_data = data[index].sub_types
              new_data = data[index].product_sub_type
            }
        }
        for (let index = 0; index < topnav.length; index++) {
            if (id == topnav[index].id) {
                topnav[index].isactive = true
            } else {
                topnav[index].isactive = false
            }
        }
        new_data = new_data.map((item) => {
            return {
                name: item.t_sub_name,
                price: (item.price_default_fix + item.price_default_flow) / 2,
                unit: item.unit == 0 ? '元/个' : '元/公斤'
            }
        })
        that.setData({
            search_data: new_data,
            price_topName: topnav
        })
    },
    // 去下订单
    go_tolist() {
        wx.navigateTo({
            url: '../recovery/recovery'
        })
    }

})