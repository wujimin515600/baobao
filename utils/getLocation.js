import http from "./http.js"
import dialog from "./dialog.js"
import { conversion} from 'util.js';
const getLocation = {
    isGetLocation(obj, type) {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    dialog.confirm('未开启定位授权,请开启授权', () => {
                        wx.openSetting({
                            success: data => {
                                if (data.authSetting["scope.userLocation"] == true) {
                                    dialog.tips('授权成功')
                                    //再次授权，调用getLocationt的API
                                    this.getLocation(obj, type)
                                } else {
                                    obj.setData({
                                        getlocationType: true
                                    })
                                    dialog.tips('授权失败')
                                }
                            }
                        })
                    }, () => {
                        obj.setData({
                            getlocationType: true
                        })
                        dialog.tips('未开启授权')
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    this.getLocation(obj, type)
                } else { //授权后默认加载
                    this.getLocation(obj, type)
                }
            }
        })
    },
    getLocation(obj, type) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              var latitude = conversion(res.latitude)
              var longitude = conversion(res.longitude)
                obj.setData({
                    ldata: true,
                    latitude: latitude,
                    longitude: longitude
                })
              if (!latitude && !longitude) return;
                http.get('nearby', {
                    data: {
                        lng: longitude,
                        lat: latitude
                    },
                    success: res => {
                        if (type == 'index') {
                            obj.setData({
                                siteList: res.closest.slice(0, 1),
                                getlocationType: res.closest && res.closest.length == 0 ? true : false
                            })
                          console.log('siteList',res.closest.slice(0,1))
                        } else {
                            obj.setData({
                                siteList: res.closest,
                                getlocationType: res.closest && res.closest.length == 0 ? true : false
                            })
                        }
                    },
                    fail: res => {
                        dialog.tips(res.result)
                    }

                })
            }
        })
    },
    moveMap(lng, lat, obj) {
      lng = conversion(lng)
      lat = conversion(lat)
      if(!lng && !lat) return;
        http.get('nearby', {
            data: {
                lng: lng,
                lat: lat
            },
            success: (res) => {
                obj.setData({
                    siteList: res.closest,
                    getlocationType: res.closest && res.closest.length == 0 ? true : false
                })

            },
            fail: (res) => {
                dialog.tips(res.result)
            }

        })
    }
}

export default getLocation