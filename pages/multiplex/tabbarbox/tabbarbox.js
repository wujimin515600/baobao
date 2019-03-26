import user from '../../../utils/user'
import util from '../../../utils/util'
Component({
    data: {
        list: [{
                "id": 0,
                "iconPath": "/images/dianhuazixunhuawuzongheguanlibl.png",
                "text": "电话收货"
            },
            {
                "id": 1,
                "iconPath": "/images/xiadan.png",
                "text": "一键回收"
            },
            {
                "id": 2,
                "iconPath": "/images/peopleicon.png",
                "text": "个人中心"
            },
        ],
        buttonClicked: false,
    },
    methods: {
        navClick(e) {
            var that = this
            let data = e.currentTarget.dataset
            if (data.item.id == 0) {
                wx.makePhoneCall({
                    phoneNumber: '0411-62623999' //仅为示例，并非真实的电话号码
                })
                return false
            }
            if (user.isLogin()) {
                if (data.item.id == 2) {
                    var url = '/pages/userCenter/center/center'
                    wx.navigateTo({
                        url: url
                    })

                } else if (data.item.id == 1) {
                    var url = '/pages/recovery/recovery'
                    // var url = '/pages/order/orderindex/orderindex'
                    wx.navigateTo({
                        url: url
                    })
                }
                // user.login(() => {

                // }, () => {
                //     that.setData({
                //         buttonClicked: false
                //     })
                // })
            } else {
                var url = '/pages/user/register/register'
                wx.navigateTo({
                    url: url,
                })
            }
        }
    },
})