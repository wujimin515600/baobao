import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import {
    transaction_type
} from '../../../global.js'
Page({
    data: {
        balancelist: [],
        listpage: 0,
        sum_page: 1,
        isHideLoadMore: false,
        transaction_type,
        userinfo: {}
    },
    onShow() {
        this.setData({
            userinfo: user.info()
        })
        this.balanceList()
        this.setData({
            transaction_type: transaction_type
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading() //在标题栏中显示加载

        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
    //加载更多
    onReachBottom: function (e) {
        var that = this
        var listpage = null
        listpage = that.data.listpage + 1
        that.setData({
            listpage: listpage
        })
        if (listpage <= that.data.sum_page) {
            wx.showToast({
                title: '加载中！',
                icon: 'loading',
                duration: 1000
            })
            that.balanceList();
        } else if (listpage > that.data.sum_page) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }
    },
    balanceList() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('listhistory', {
            data: {
                user_sid: user,
                page: that.data.listpage
            },
            success: (res) => {
                if (that.data.listpage == res.n_pages) {
                    that.setData({
                        isHideLoadMore: true
                    })
                }
                if (that.data.listpage == 0) {
                    that.setData({
                        balancelist: res.history,
                        sum_page: res.n_pages,
                    })
                } else {
                    var resp = that.data.balancelist
                    var balancelist = res.history
                    for (let index = 0; index < balancelist.length; index++) {
                        resp.push(balancelist[index])
                    }
                    that.setData({
                        balancelist: resp,
                        isHideLoadMore: true
                    })
                }
            },
            fail: (res) => {
                dialog.tips(res.result)
            }
        })

    }

})