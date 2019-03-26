var app = getApp()
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import { conversion } from '../../../utils/util.js'
import {
    domain,
    iconUrl
}
from '../../../global.js'
Page({
    data: {
        map_width: 380,
        map_height: 380,
        sitetype: true,
        markers: [],
        scrollTop: 0,
        sitetype: 'list',
        id: '',
        lat: '',
        lng: '',
        location: {},
        labelList: [],
        boxHeight: 0
    },
    onLoad(e) {
        this.setData({
            id: e.id,
        })
        let res = wx.getSystemInfoSync();
        let boxHeight = res.windowHeight - 312;
        this.setData({
            'boxHeight': boxHeight
        });
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                this.setData({
                    location: res,
                })
                this.detail(res.longitude, res.latitude)
            },
        })

    },
    detail(lng, lat) {
        var that = this
      lng = conversion(lng)
      lat = conversion(lat)
      if (!lng && !lat) return;
        http.get('nearby_detail', {
            data: {
                lng: lng,
                lat: lat,
                rb_id: that.data.id
            },
            success: res => {
                if (res.result == 200) {
                    var data = {}
                    data.iconPath = '/images/recoveryicon.png'
                    data.width = 41
                    data.height = 43
                    data.latitude = res.recycle_bin.GPS_A
                    data.longitude = res.recycle_bin.GPS_L
                    data.loc_desc = res.recycle_bin.loc_desc
                    data.name = res.recycle_bin.rb_name ? res.recycle_bin.rb_name : ''
                    data.admin_name = res.recycle_bin.admin_name[0]
                    data.distance = res.distance
                    // data.recommend = res.position_desc.formatted_addresses.recommend
                    data.icon = iconUrl + res.recycle_bin.type_list.type_id
                }
                let current = {
                    iconPath: "/images/currenticon.png",
                    latitude: lat,
                    longitude: lng,
                    width: 16,
                    height: 26,
                }
                var dataicon = res.recycle_bin.type_list
                for (let i = 0; i < dataicon.length; i++) {
                    dataicon[i].icon = iconUrl + dataicon[i].type_id
                }
                that.setData({
                    markers: [data, current],
                    labelList: dataicon
                })
                console.log(that.data.markers)
            }
        })
    },

    gpsClick() {
        var that = this
        wx.openLocation({
            latitude: parseFloat(that.data.markers[0].latitude),
            longitude: parseFloat(that.data.markers[0].longitude),
            scale: 18,
            name: that.data.markers[0].name,
            address: (that.data.markers[0].distance / 1000).toFixed(2) + 'km'
        })
    },
    tel() {
        wx.makePhoneCall({
            phoneNumber: '0411-62623999' //仅为示例，并非真实的电话号码
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
                }
            })
        }
    }
    // parent() {
    //     console.log(222)
    // }

})