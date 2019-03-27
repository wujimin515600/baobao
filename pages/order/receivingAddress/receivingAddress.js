import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
const app = getApp();
Page({
    data: {
        buttontype: false,
        addr: '',
        // addressType: false,
        phone: '',
        userinfo: {},
        longd: {}
    },
    onLoad() {
        this.setData({
            userinfo: user.info()
        })
        this.receiving()
    },
    receiving() {
        var that = this
        that.address()
    },
    address() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('adress', {
            data: {
                user_sid: user
            },
            success: res => {
                that.setData({
                    mapaddress: res.delivery_info.address,
                    phone: res.delivery_info.contact_pn ? res.delivery_info.contact_pn : res.pn,
                    contact: res.delivery_info.contact,
                    house_number: res.delivery_info.house_number,
                    buttontype: res.delivery_info.address != '' && res.delivery_info.contact_pn != '' ? true : false,
                })
            }
        })
    },

    bindReplaceInput(e) {
        var that = this
        var len = e.detail.value.length
        console.log(that.data.mapaddress)
        if (len == 11 && that.data.mapaddress != '') {
            that.setData({
                buttontype: true,
            })
        } else {
            that.setData({
                buttontype: false,
            })
        }
    },

    clickAddress() {
        var that = this
        app.getPermission(that, function () {
            if (that.data.phone.length == 11) {
                that.setData({
                    buttontype: true,
                    mapaddress: that.data.addr,
                    local: that.data.longd
                })
            }
            // that.setData({

            //     addressType: true
            // })
        })
    },

    formSubmit(e) {
        var that = this
        let data = e.detail.value
        let user = that.data.userinfo.user_sid
        let local = that.data.local
        if (data.mapaddress != '' && data.phone.length == 11) {
            http.post('submitadress', {
                data: {
                    data: {
                        user_sid: user,
                        address: data.mapaddress,
                        contact_pn: data.phone,
                        contact: data.contact ? data.contact : '',
                        house_number: data.house_number ? data.house_number : '',
                        lat: local ? that.data.local.latitude : null,
                        leg: local ? that.data.local.longitude : null
                    }
                },
                success: res => {
                    console.log(res);

                    if (res.result == 200) {
                        var pages = getCurrentPages();
                        if (pages.length > 1) {
                            //上一个页面实例对象
                            var prePage = pages[pages.length - 2];
                            var info = prePage.data
                            //关键在这里
                            console.log(info)
                            let uid = res.addr.id ? res.addr.id : info.takeAddress.id
                            prePage.changeAddress(e.detail.value, uid)
                        }
                        console.log(1);

                        dialog.tips('保存成功')
                        setTimeout(function () {
                            wx.navigateBack({})
                        }, 1000)
                    }
                }
            })
        }
    }

})