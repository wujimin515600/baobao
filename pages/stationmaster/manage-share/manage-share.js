import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import {
    domain,
    api
} from '../../../global.js'

Page({
    data: {
        userinfo: {},
        captchaImage: '',
        loadingHidden: false,
        backgroundImage: false,
        photo: false,
        shareVisable: true,
        hasAuth: true,
    },
    onLoad(e) {
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    systemInfo: res
                })
            }
        })

        this.setData({
            userinfo: user.info()
        });

        this.getBg()

    },
    onShareAppMessage(res) {
        let referrer_code = wx.getStorageSync('referrerInfo').referrer_code

        return {
            title: '赶快加入保保回收，一起为公益助力吧！',
            path: '/pages/user/activeregister/activeregister?recommender_code=' + referrer_code
        }
    },
    onShow() {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.writePhotosAlbum'] == false) {
                    this.setData({
                        hasAuth: false
                    })
                }
            }
        })
    },
    cancel() {
        wx.navigateBack({
            delta: 1
        })
    },
    closeShareDialog() {
        this.setData({
            shareVisable: false
        })
    },
    getBg() {
        wx.downloadFile({
            url: 'https://b.bbrecycle.cn/static_banners/share/bg-referrer-share.jpeg',
            success: res => {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    let data = res.data
                    this.setData({
                        backgroundImage: res.tempFilePath
                    })

                    this.sort_qr()
                }
            }
        })
    },
    sort_qr() {
        let user = this.data.userinfo.user_sid
        wx.downloadFile({
            url: domain + api.referrerQr + '?user_sid=' + user,
            success: res => {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    let data = res.data
                    if (res.statusCode == 200) {
                        this.setData({
                            loadingHidden: true,
                            captchaImage: res.tempFilePath
                        })
                        this.setCanvas()
                    }
                }
            }
        })
    },
    save() {
        if (this.data.shareVisable) {
            return false
        }
        let systemInfo = this.data.systemInfo

        wx.canvasToTempFilePath({
            x: 0,
            y: 20,
            width: systemInfo.windowWidth,
            height: systemInfo.windowHeight,
            destWidth: systemInfo.windowWidth,
            destHeight: systemInfo.windowHeight,
            canvasId: 'myCanvas',
            success: res => {
                this.setData({
                    photo: res.tempFilePath
                })
                this.toPhotosAlbum()
            }
        })
    },
    getAuth() {
        wx.openSetting({
            success: settingdata => {
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    this.setData({
                        hasAuth: true
                    })
                }
            }
        })
    },
    toPhotosAlbum() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.photo,
            success: function (data) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (err) => {
                console.log(err);
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    console.log("当初用户拒绝，再次发起授权")
                }
                this.setData({
                    hasAuth: false
                })
            },
        })
    },
    setCanvas() {
        let windowWidth = this.data.systemInfo.windowWidth
        const ctx = wx.createCanvasContext('myCanvas')
        let unit = 2.165 //宽高比系数
        let code_y = 1.03 //高度系数
        let width = windowWidth / 2.5

        ctx.drawImage(this.data.backgroundImage, 0, 0, windowWidth, windowWidth * unit)
        ctx.draw()
        ctx.save();

        // 画二维码
        ctx.beginPath();
        ctx.arc(windowWidth / 2, code_y * windowWidth, width / 2, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(this.data.captchaImage, (windowWidth - width) / 2, code_y * windowWidth - (width / 2), width, width); // 推进去图片，必须是https图片
        ctx.draw(true)
        ctx.restore();
    }
})