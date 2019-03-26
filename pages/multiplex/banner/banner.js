import {
    domain,
    iconUrl
}
from '../../../global.js'
import http from "../../../utils/http";
Component({
    data: {
        // 轮播
        bannerUrls: [{
                url: domain + 'appearance/banner/banner1.jpg',
                link: ''
            },
            {
                url: domain + 'appearance/banner/banner2.jpg',
                link: ''
            },
            {
                url: domain + 'appearance/banner/banner3.jpg',
                link: ''
            }
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        swiperCurrent: 0
    },
    methods: {
        changeIndicatorDots: function (e) {
            this.setData({
                indicatorDots: !this.data.indicatorDots
            })
        },
        changeAutoplay: function (e) {
            this.setData({
                autoplay: !this.data.autoplay
            })
        },
        intervalChange: function (e) {
            this.setData({
                interval: e.detail.value
            })
        },
        durationChange: function (e) {
            this.setData({
                duration: e.detail.value
            })
        },
        swiperChange(e) {
            let current = e.detail.current;
            let that = this;
            that.setData({
                swiperCurrent: current,
            })
        },
        banner(data) {
            http.get("banner", {
                data: {
                    seq: data
                },
                success: res => {
                    var das = this.data.bannerUrls
                    das[data].link = res.url
                    this.setData({
                        bannerUrls: das
                    })
                }
            })
        },
        bannerlist(e) {
            let url = encodeURI(e.target.dataset.link)
            //let url = "http://www.baidu.com"
            if (url) {
                wx.navigateTo({
                    url: '/pages/out/out?id=' + url
                })
            }

        },
    },
    created() {
        this.banner(0)
        this.banner(1)
        this.banner(2)
    },
})