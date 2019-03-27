import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import time from '../../../utils/util'
Page({
    data: {
        list: [],
        userinfo: {},
        pn: '',
        name: '',
        client: '',
        date: '',
        selectData: '',
        isHideLoadMore: false,
        listpage: 0,
        sum_page: 1,
    },
    onLoad(e) {
        this.setData({
            name: e.name,
            pn: e.pn,
            client: e.client
        })
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.summaryDetail()
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
            that.summaryDetail();
        } else if (listpage > that.data.sum_page) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }
    },
    // 选择时间
    bindDateChange(e) {
        let times = new Date(e.detail.value)
        let time = times.valueOf()
        time = time / 1000 - 8 * 3600
        this.setData({
            date: e.detail.value,
            selectData: time
        })
        this.summaryDetail()
    },

    // 详情数据
    summaryDetail() {
        let that = this
        let user = that.data.userinfo.user_sid
        let client = that.data.client
        http.get('promotionDetail', {
            data: {
                user_sid: user,
                client: client,
                start_date: that.data.selectData ? that.data.selectData : ''
            },
            success: res => {
                if (res.details.length == 0) {
                    that.setData({
                        isHideLoadMore: false,
                        list: res.details,
                    })
                } else {
                    res.details = res.details.map((item) => {
                        return {
                            phone: that.data.pn,
                            name: that.data.name ? that.data.name : '',
                            amount: item.amount,
                            promotion: item.promotion,
                            complete_time: item.complete_time * 1000
                        }
                    })
                    if (that.data.listpage == res.n_pages) {
                        that.setData({
                            isHideLoadMore: true
                        })
                    }
                    if (that.data.listpage == 0) {
                        that.setData({
                            list: res.details,
                            sum_page: res.n_pages
                        })
                    } else {
                        var resp = that.data.list
                        var seachlist = res.details
                        for (let index = 0; index < seachlist.length; index++) {
                            resp.push(seachlist[index])
                        }
                        that.setData({
                            list: resp,
                            isHideLoadMore: true
                        })
                    }
                }
            },
            fail: res => {
                dialog.tips(res.result);
            }
        })
    },

})