import verify from '../../../utils/verify'
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http';
var interval = null //倒计时函数
const app = getApp();
Page({
    data: {
        numberInput: '',
        sid: '',
        Length: 4, //输入框个数 
        isFocus: true, //聚焦 
        Value: "", //输入的内容 
        ispassword: true,
        second: 60,
        regType: false,
        disabled: true
    },
    onLoad(e) {
        console.log(e)
        this.setData({
            numberInput: e.phone,
            code: e.code
        })
    },

    onShow() {
        this.countdown(this)
        this.numstl()
        let loginInfo = wx.getStorageSync('loginInfo')
        this.setData({
            sid: loginInfo.sid
        })
    },

    numstl() {
        var that = this
        var len = that.data.numberInput
        var number = that.data.numberInput.replace(/[^0-9]/ig, "");
        var arr = number.split('');
        if (arr.length >= 4) {
            arr.splice(3, 0, ' ');
        }
        if (arr.length >= 9) {
            arr.splice(8, 0, ' ');
        }
        number = arr.join('')
        this.setData({
            numberInput: number
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
    fouts() {
        var that = this;
        that.setData({
            isFocus: true,
            ispassword: true
        })
    },
    Tap() {
        var that = this;
        that.setData({
            isFocus: true,
        })
    },
    //验证码倒计时函数
    countdown(that) {
        var second = that.data.second;
        that.setData({
            disabled: true,
        });
        if (second == 0) {
            that.setData({
                disabled: false,
                second: '60',
            });
            return;
        }
        var time = setTimeout(function () {
            that.setData({
                second: second - 1,
            });
            that.countdown(that);
        }, 1000)
    },
    again() {
        var that = this
        let phone = that.data.numberInput.replace(/[^0-9]/ig, "")
        that.wxLogin(phone, 0)
    },

    // 注册
    reg() {
        var that = this;
        that.setData({
            regType: false,
        })
        var phone = that.data.numberInput.replace(/[^0-9]/ig, "")
        http.post('register', {
            data: {
                data: {
                    pn: phone,
                    sid: that.data.sid,
                    vcode: that.data.Value
                }
            },
            success: (res) => {
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
        })
    },
    goBack() {
        wx.navigateBack()
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
                        if (type == 0) {
                            that.countdown(that)
                            that.setData({
                                sid: res.sid
                            })
                        } else {
                            wx.removeStorageSync('loginInfo')
                            wx.setStorageSync('userInfo', res)
                        }
                    },
                    fail: res => {
                        dialog.tips(res.result)
                    }
                })
            }
        })
    }
})