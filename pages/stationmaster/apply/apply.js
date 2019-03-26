import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
Page({
    data: {
        apply_guide: [{
            num: '1.',
            text: '站长权益：用户通过站长分享的二维码注册，站长在有效期内享受该用户的所有订单的提成； '
        }, {
            num: '2.',
            text: '长有效期：由保保回收审核通过站长资格，站长资格有一定的有效期（ 目前为6个月）， 过后需重新申请， 此有效期长短解释权归保保回收所有； '
        }, {
            num: '3.',
            text: '站长资格：当站长连续一段时间未吸引新的用户进入或者已有业务量过低时， 保保回收有权力取消该站长资格； '
        }, {
            num: '4.',
            text: '在1-2个工作日内通过申请。 '
        }, {
            num: '5.',
            text: '所有解释权归保保回收所有。 '
        }],
        name: '',
        remarks: '',
        userinfo: {},
    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
    },
    applyName(e) {
        var that = this
        var name = e.detail.value
        that.setData({
            name: name,
        })
    },
    applyRemarks(e) {
        var that = this
        var remark = e.detail.value
        that.setData({
            remarks: remark,
        })
    },
    suerApply() {
        var that = this
        let user = that.data.userinfo.user_sid
        let name = that.data.name
        let remark = that.data.remarks
        if (name != '') {
            http.post("referrer", {
                data: {
                    data: {
                        user_sid: user,
                        name: name,
                        comment: remark
                    }
                },
                success: res => {
                    if (res.result == 200) {
                        dialog.tips('申请成功，等待审核');
                        setTimeout(() => {
                            wx.navigateBack({})
                        }, 1500)
                    }
                },
                fail: res => {
                    dialog.tips(res.result);
                }
            })
        } else {
            dialog.tips("请填写姓名");
        }
    }

})