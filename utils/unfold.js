const unfold = {
    showContent(obj, obj1, obj2) {
        var that = obj
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear'
        })

        that.animation = animation
        animation.height("0").opacity(0).step()

        let dataObj = {}
        dataObj[obj2] = animation.export()
        dataObj[obj1] = true

        that.setData(dataObj)

        setTimeout(function () {
            animation.height("480rpx").opacity(1).step({
                duration: 300
            })
            let Obj = {}
            Obj[obj2] = animation.export()
            that.setData(Obj)
        }, 50)

        setTimeout(function () {
            that.setData({
                stopBtn: false
            })
        }, 500)
    },


    hideContent(obj, obj1, obj2, obj3) {
        var that = obj;
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.height(0).opacity(0).step({
            duration: 300
        })
        let Obj = {}
        Obj[obj2] = animation.export()
        that.setData(Obj)

        setTimeout(function () {
            let dataObj = {}
            dataObj[obj1] = false
            dataObj[obj2] = animation.export()

            animation.height("480rpx").step();

            that.setData(dataObj)
        }, 300)
        that.setData({
            stopBtn: true
        })
    },
}
export default unfold