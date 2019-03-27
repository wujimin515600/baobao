Page({
    data: {
        realType: false,
        phone: null,
        realname: ''
    },
    onLoad(e) {
        this.setData({
            phone: e.phone,
            realType: e.realname == 0 ? true : false
        })
    },
    onShow() {

    },
    realname() {
        if (this.data.realType == false) {
            wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
                url: "/pages/userCenter/set/set"
            })
        } else {
            wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
                url: "/pages/userCenter/realname/realname"
            })
        }
    }
})