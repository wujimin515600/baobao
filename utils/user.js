import http from './http.js'
import dialog from './dialog.js'
const user = {
    login(phone, obj, fail) {
        wx.login({
            success: res => {
                http.post('login', {
                    data: {
                        data: {
                            code: res.code,
                            pn: phone
                        }
                    },
                    success: res => {
                        if (res.state != 0) {
                            wx.setStorageSync('userInfo', res)
                            wx.reLaunch({
                                url: '/pages/home/home'
                            })
                        } else {
                            wx.setStorageSync('loginInfo', res)
                            wx.navigateTo({
                                url: "/pages/user/verificationCode/verificationCode?phone=" + phone
                            })
                        }
                    },
                    fail: res => {
                        dialog.tips(res.result)
                    }
                })
            }
        })
    },
    // 获取用户信息
    info() {
        return wx.getStorageSync('userInfo')
    },
    isLogin(params, needLogin) {
        if (this.info()) {
            if (params && typeof params.success == "function") {
                params.success()
            }
            return true
        }
        if (needLogin) {
            var url = '/pages/user/register/register'
            wx.navigateTo({
                url: url,
            })
            return false
        }
        if (params && typeof params.fail == "function") {
            params.fail()
        }
        return false
    }
}

export default user