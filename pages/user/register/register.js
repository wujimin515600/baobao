import verify from '../../../utils/verify'
import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
Page({
    data: {
        inputType: false,
        inputValue: null,
        text: '',
        hidden: false,
        sid: '',
        cardlen: 0,
    },
    bindReplaceInput(e) {
        var that = this
        var len = e.detail.value.length
        var number = e.detail.value.replace(/[^0-9]/ig, "");
        var number = e.detail.value
        that.setData({
            inputType: true,
            inputValue: number
        })
    },
    reg() {
        var that = this
        let phone = that.data.inputValue
        if (!verify.verifyPhone(phone)) {
            dialog.alert('请输入正确的手机号')
        } else {
            that.setData({
                inputType: true,
                inputValue: that.data.inputValue
            })
            user.login(phone)
        }
    },
})