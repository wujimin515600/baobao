import verify from '../../../utils/verify'
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http';
var interval = null //倒计时函数
const app = getApp();
Page({
    data: {
        sid: '',
        Length: 4, //输入框个数 
        isFocus: true, //聚焦 
        Value: "", //输入的内容 
        ispassword: true,
        second: 60,
        regType: false,
        disabled: false,
        inputValue: '',
        userinfo: {},
        salesman: '',
        saleName: ''
    },
    onLoad(e) {
        this.setData({
            userinfo: user.info(),
            salesman: e.recommender_code
            //numberInput: e.phone,
            //code: e.code
        })
    },

    onShow() {
        this.salesmanName()
        // this.countdown(this)
        // this.numstl()
        // let loginInfo = wx.getStorageSync('loginInfo')
        // this.setData({
        //     sid: loginInfo.sid
        // })
    },
    bindReplaceInput(e) {
        var that = this
        var len = e.detail.value.length
        var number = e.detail.value.replace(/[^0-9]/ig, "");
        var number = e.detail.value
        that.setData({
            inputType: true,
            inputValue: number,
            regType: true
        })
    },
    salesmanName() {
        let that = this
        http.get('name', {
            data: {
                recommender_code: that.data.salesman
            },
            success: res => {
                that.setData({
                    saleName: res.recommender.name
                })
            }
        })

    },
    Focus(e) {
        var that = this;
        var inputValue = e.detail.value;
        that.setData({
            Value: inputValue,
            regType: true
        })
        if (inputValue.length != 0) {
            that.setData({
                ispassword: false,
            })
        } else {
            that.setData({
                ispassword: true,
            })
        }
        if (inputValue.length == 4) {
            that.setData({
                regType: true,
                Value: inputValue,
            })
        }
    },

    getVerificationCode() {
        let phone = this.data.inputValue.replace(/[^0-9]/ig, "")

        if (phone) {
            this.wxLogin(phone, 0)
        }
    },
    //验证码倒计时函数
    countdown() {
        var second = this.data.second;
        this.setData({
            disabled: true,
        });
        if (second == 0) {
            this.setData({
                disabled: false,
                second: '60',
            });
            return;
        }
        var time = setTimeout(res => {
            this.setData({
                second: second - 1,
            });
            this.countdown();
        }, 1000)
    },
    again() {
        let phone = this.data.numberInput.replace(/[^0-9]/ig, "")
        that.wxLogin(phone, 0)
    },

    // 注册
    reg() {
        var that = this;
        that.setData({
            regType: false,
        })
        var phone = that.data.inputValue.replace(/[^0-9]/ig, "")
        http.post('register', {
            data: {
                data: {
                    pn: phone,
                    sid: that.data.sid,
                    vcode: that.data.Value,
                    recommender_code: that.data.salesman
                }
            },
            success: (res) => {
                let that = this
                if (res.result == 200) {
                    that.wxLogin(phone, 1)
                    dialog.tips('注册成功')
                    var time = setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/home/home'
                        })
                    }, 1500)
                } else {
                    that.setData({
                        regType: true,
                        Value: ''
                    })
                }
            },
            fail: (res) => {
                let that = this
                that.setData({
                    regType: true,
                    Value: ''
                })
            }
        })
    },
    wxLogin(phone, type) {
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
                        let that = this
                        if (res.state == 1) {
                            dialog.tips('已注册过用户')
                            return false
                        }
                        if (type == 0) {
                            that.countdown()
                            that.setData({
                                sid: res.sid
                            })
                        } else {
                            wx.removeStorageSync('loginInfo')
                            wx.setStorageSync('userInfo', res)
                        }
                    },
                    fail: res => {
                        dialog.tips(res.reason)
                    }
                })
            }
        })
    }

})