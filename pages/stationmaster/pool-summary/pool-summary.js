import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
Page({
    data: {
        inputValue: '',
        list: [],
        userinfo: {},
        listpage: 0,
        sum_page: 1,
        isHideLoadMore: false,
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.serachData()
    },
    // 搜索
    serach_input(event) {
        this.setData({
            inputValue: event.detail.value
        })
    },
    // 执行搜索
    query() {
        this.serachData()
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
            console.log(2)
            wx.showToast({
                title: '加载中！',
                icon: 'loading',
                duration: 1000
            })
            that.serachData();
        } else if (listpage > that.data.sum_page) {
            console.log(4)
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }
    },
    // 列表数据
    serachData() {
        let that = this
        let user = that.data.userinfo.user_sid
        http.get('referrerAgg', {
            data: {
                user_sid: user,
                pn_or_name: that.data.inputValue
            },
            success: res => {
                if (res.clients.length == 0) {
                    that.setData({
                        list: res.clients,
                        isHideLoadMore: false
                    })
                } else {
                    if (that.data.listpage == res.n_pages) {
                        that.setData({
                            isHideLoadMore: true
                        })
                    }
                    if (that.data.listpage == 0) {
                        that.setData({
                            list: res.clients,
                            sum_page: res.n_pages
                        })
                    } else {
                        var resp = that.data.list
                        var seachlist = res.clients
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
    // 跳转去详情页
    go_detail(e) {
        let client = e.currentTarget.dataset.client;
        let pn = e.currentTarget.dataset.pn;
        let name = e.currentTarget.dataset.name ? e.currentTarget.dataset.name : '';
        wx.navigateTo({
            url: "/pages/stationmaster/summary-detail/summary-detail?client=" + client + '&pn=' + pn + '&name=' + name
        })
    }

})