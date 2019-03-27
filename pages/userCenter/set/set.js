import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
Page({
    data: {
        userinfo: {}
    },
    onShow() {
        this.setData({
            userinfo: user.info()
        })
    },
    loginOut() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('loginOut', {
            data: {
                user_sid: user
            },
            success: res => {
                dialog.tips(res.result)
                wx.clearStorage()
                var url = '/pages/home/home'
                wx.reLaunch({
                    url: url
                })
            },
            fail: res => {
                dialog.tips(res.result)
            }
        })
    }
})