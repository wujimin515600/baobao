import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import getLocation from '../../../utils/getLocation'
import {
    domain,
    iconUrl
}
from '../../../global.js'
const app = getApp();
Component({
    properties: {
        labelType: String,
        lngs: String,
        lats: String,
    },
    data: {
        siteList: [],
        // location: false,
        getlocationType: false,
    },
    methods: {
        refreshClcik() {
            var that = this
            getLocation.isGetLocation(that, that.data.labelType)
        },
        moveCLick() {
            var that = this
            getLocation.moveMap(that.data.lngs, that.data.lats, that)
            // getLocation.isGetLocation(that, that.data.labelType)
        },
        calltel() {
            wx.makePhoneCall({
                phoneNumber: '0411-62623999'
            })
        }
    },
    ready() {
        var that = this
        that.setData({
            iconUrl: iconUrl
        })

    }
})