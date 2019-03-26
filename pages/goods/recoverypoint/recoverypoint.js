var app = getApp()
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import { conversion } from '../../../utils/util.js'
Page({
    data: {
        map_width: 380,
        map_height: 380,
        sitetype: true,
        markers: [{}],
        scrollTop: 0,
        sitetype: 'list',
        id: '',
        lat: '',
        lng: '',
        location: {},
        labelList: [],
        boxHeight: 0,
        movelng: '',
        movelat: ''
    },
    onReady() {
        this.mapList.refreshClcik()
    },
    onLoad() {
        let res = wx.getSystemInfoSync();
        let boxHeight = res.windowHeight - 312;
        this.setData({
            'boxHeight': boxHeight
        });

    },
    onShow() {
        this.mapList = this.selectComponent("#mapList")
        this.mapList.refreshClcik()
        wx.getLocation({
            type: 'gcj02',
            success: res => {
              // console.log('res',res)
                this.setData({
                    location: res,
                })
                // console.log(res,'经纬度')
              this.detail(res.longitude, res.latitude)
            },
        })
    },
    // parent() {
    //     console.log(222)
    // },
    detail(lng, lat) {
      // console.log('ops', lng, lat)
        var that = this
        if(!lng && !lat) return;
         lng = conversion(lng)
         lat = conversion(lat)
        http.get('nearby', {
            data: {
                lng: lng,
                lat: lat,
            },
            success: res => {
                if (res.result == 200) {
                    var data = res.closest
                    for (let index = 0; index < data.length; index++) {
                        data[index].iconPath = '/images/recoveryicon.png'
                        data[index].width = 41
                        data[index].height = 43
                        data[index].latitude = data[index].recycle_bin.GPS_A
                        data[index].longitude = data[index].recycle_bin.GPS_L
                    }
                    let current = {
                        iconPath: "/images/currenticon.png",
                        latitude: lat,
                        longitude: lng,
                        width: 16,
                        height: 26,
                    }
                    data.unshift(current)
                    console.log(data)
                    that.setData({
                        markers: data,
                        //labelList: res.recycle_bin.type_list
                    })
                }
            },

        })
    },

    // 地图移动获取定位
    regionchange(e) {
        var that = this;
        that.mapCtx = wx.createMapContext("map");
        if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
            that.mapCtx.getCenterLocation({
                type: 'gcj02',
                success: res => {
                    let lng = res.longitude
                    let lat = res.latitude
                    that.detail(lng, lat)
                    that.setData({
                        movelng: res.longitude,
                        movelat: res.latitude
                    })
                }
            })
            that.mapList.moveCLick()
        }
    }
})