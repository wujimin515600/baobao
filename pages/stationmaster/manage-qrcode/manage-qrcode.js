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
        hasAuth: true,
        canvasInfo: {},
        systemInfo: {}
    },
    onLoad(e) {
        wx.createSelectorQuery().select('#myCanvas').fields({
            size: true,
        }, (res) => {
            this.setData({
                canvasInfo: res
            })
        }).exec()

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
    getBg() {
        wx.downloadFile({
            url: 'https://b.bbrecycle.cn/static_banners/share/banner-share-card.png',
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
        let canvasInfo = this.data.canvasInfo

        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasInfo.windowWidth,
            height: canvasInfo.windowHeight,
            destWidth: canvasInfo.windowWidth,
            destHeight: canvasInfo.windowHeight,
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
        let cWidth = this.data.canvasInfo.width
        let u = cWidth / 653
        let width = 362 * u
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.save()
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cWidth, this.data.canvasInfo.height);

        ctx.drawImage(this.data.backgroundImage, 0, 0, cWidth, 296 * u)
        ctx.draw(true)

        // 画二维码
        ctx.drawImage(this.data.captchaImage, (cWidth - width) / 2, 340 * u, width, width); // 推进去图片，必须是https图片
        ctx.draw(true)
        ctx.restore();

        ctx.fillStyle = "#171A25";

        ctx.setFontSize(28 * u)
        ctx.setTextAlign('center')
        ctx.fillText("扫一扫或长按小程序码", cWidth / 2, 760 * u);
        ctx.fillText("马上和好友一起为公益助力", cWidth / 2, 810 * u);
        ctx.draw(true)

        ctx.fillStyle = "black";
        ctx.setFontSize(32 * u)
        ctx.fillText("保保站长：" + wx.getStorageSync('referrerInfo').name, cWidth / 2, 910 * u);

        let line_y = 850
        ctx.setStrokeStyle('#E3E4EA')
        ctx.moveTo(26 * u, line_y * u)
        ctx.lineTo((650 - 26) * u, line_y * u)
        ctx.stroke()
        ctx.draw(true)

    }
})