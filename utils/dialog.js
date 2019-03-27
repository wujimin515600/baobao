import {
    error
} from '../global'

const dialog = {
    tips(code, success) {

        let msg = this.handleError(code) || ''

        wx.showToast({
            title: msg,
            icon: "none",
            mask: true,
            success,
        })
    },

    loading() {
        wx.showLoading({
            title: "加载中...",
            mask: true,
        })
    },

    hideLoading() {
        wx.hideLoading()
    },

    alert(content, success, fail) {
        wx.showModal({
            title: '提示',
            content,
            showCancel: false,
            success: function (res) {
                if (res.confirm && typeof success == "function") {
                    success()
                } else if (typeof fail == "function") {
                    fail()
                }
            }
        })
    },

    confirm(content, success, fail) {
        wx.showModal({
            title: '提示',
            content,
            success: function (res) {
                if (res.confirm && typeof success == "function") {
                    success()
                } else if (typeof fail == "function") {
                    fail()
                }
            }
        })
    },

    handleError(code) {
        if (error[code]) {
            return error[code]
        } else {
            return code
        }
    }
}

export default dialog