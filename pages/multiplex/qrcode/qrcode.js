var QR = require("../../../utils/weapp-qrcode.js");
var qrcode;
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
Component({
    properties: {
        info: String
    },
    data: {
        qrcode: '',
        userinfo: {},
        types: false,
        classtype: false
    },
    ready: function () {
        this.setData({
            userinfo: user.info()
        })
        this.qrcodes()
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getQRCodeSize: function () {
            var size = 0;
            try {
                var res = wx.getSystemInfoSync();
                var scale = res.windowWidth / 750; //不同屏幕下QRcode的适配比例；设计稿是750宽
                var width = 300 * scale;
                size = width;
            } catch (e) {
                // Do something when catch error
                console.log("获取设备信息失败" + e);
                size = 150;
            }
            return size;
        },
        createQRCode: function (text, size) {
            //调用插件中的draw方法，绘制二维码图片
            let that = this
            try {
                // console.log('QRcode: ', text, size)
                let _img = QR.createQrCodeImg(text, {
                    size: parseInt(size)
                })
                that.setData({
                    'qrcode': _img
                })
            } catch (e) {
                console.log(e)
            }
        },
        pervier() {
            let that = this
            //var tempFilePath = this.data.qrcode
            that.setData({
                classtype: true,
                types: true
            })
        },
        closeQy() {
            let that = this
            that.setData({
                classtype: false,
            })
            setTimeout(() => {
                that.setData({
                    types: false
                })
            }, 700);
        },
        qrcodes() {
            var that = this
            http.get('qrcode', {
                data: {
                    user_sid: that.data.userinfo.user_sid
                },
                success: res => {
                    let qrcodeSize = that.getQRCodeSize()
                    that.createQRCode(res.qr_info, qrcodeSize)
                }
            })
        }
    },
})