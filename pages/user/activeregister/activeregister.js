import verify from '../../../utils/verify'
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http';
var interval = null //倒计时函数
const app = getApp();
Page({
    data: {
        pageType: 1, //  1：站长拉新 2:邀请活动拉辛
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
        saleName: '',
        share_referrer_code: false,
    },
    onLoad(e) {
        this.setData({
            userinfo: user.info(),
        })
        if (e.recommender_code) {
            // 站长分享
            this.setData({
                pageType: '1',
                salesman: e.recommender_code
                //numberInput: e.phone,
                //code: e.code
            })

            this.salesmanName()

        } else if (e.share_referrer_code) {
            // 一对多邀请
            this.setData({
                pageType: '2',
                share_referrer_code: e.share_referrer_code
            })
        }

    },

    onShow() {

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

        if (phone.length < 11) {
            wx.showToast({
                title: '请输入有效手机号',
                icon: 'none',
            });
            return false
        }
        this.wxLogin(phone, 0)
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
    // 注册
    reg() {
        if (!this.data.sid) {
            console.log(1);

            dialog.tips('请先获取验证码')
            return false
        }
        var that = this;
        that.setData({
            regType: false,
        })
        var phone = that.data.inputValue.replace(/[^0-9]/ig, "")

        let data = {
            pn: phone,
            sid: that.data.sid,
            vcode: that.data.Value,
        }

        switch (this.data.pageType) {
            case '1':
                data.recommender_code = this.data.salesman
                break;

            case '2':
                data.extra_info = {
                    share_referrer_code: this.data.share_referrer_code
                }

                break;
            default:
                break;
        }

        http.post('register', {
            data: {
                data
            },
            success: (res) => {
                let that = this
                if (res.result == 200) {
                    that.wxLogin(phone, 1)

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
        // 这个方法同时作用法短信和登录 type：0为法短信
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

                        // 发验证码
                        if (type == 0) {
                            if (res.state == 1) {
                                // that.setData({
                                //     sid: res.user_sid
                                // })
                                dialog.tips('已注册过用户')
                                return false
                            }

                            that.countdown()
                            that.setData({
                                sid: res.sid
                            })
                        } else {
                            // 这里是登录作用
                            wx.removeStorageSync('loginInfo')
                            wx.setStorageSync('userInfo', res)
                            dialog.tips('注册成功')
                            var time = setTimeout(function () {
                                wx.reLaunch({
                                    url: '/pages/home/home'
                                })
                            }, 1500)
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