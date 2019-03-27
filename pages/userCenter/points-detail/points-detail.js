import dialog from '../../../utils/dialog'
import user from '../../../utils/user'

let app = getApp()

Page({
    data: {
        list: [],
        userinfo: {},
        listpage: 0,
        sum_page: 1,
        isHideLoadMore: true,
        t_sourceMap: {
            "0": '订单结算',
            "1": '站长提成',
            "2": '促销活动',
            "3": '用户提款'
        },
        t_stateMap: {
            "0": '到账成功',
            "1": '到账失败',
            "2": '等待处理',
            "3": '已处理，到账中'
        }
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.serachData()
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
        app.http.get('wallet/transaction/list/history/', {
            needLogin: true,
            data: {
                count_per_page: 100
            },
            success: res => {
                console.log(res);
                this.setData({
                    list: res.transactions
                })
            }
        })
    },
})