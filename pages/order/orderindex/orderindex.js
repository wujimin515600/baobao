import dialog from '../../../utils/dialog'
import user from '../../../utils/user'
import http from '../../../utils/http'
import {
    domain,
    iconUrl
}
from '../../../global.js'
const app = getApp();
Page({
    data: {
        showModalStatus: false,
        addressType: false,
        takeAddress: {},
        tel: 0,
        listData: [],
        // selectData: [],
        budgetMoney: '0.00-0.00',
        delBtnWidth: 141,
        userinfoId: '',
        boxHeight: '300',
        userinfo: {}
    },
    onLoad() {
        this.setData({
            userinfo: user.info()
        })
        this.order()
    },
    // 默认请求
    order() {
        this.list()
        this.address()
    },
    // 产品列表
    list() {
        var that = this
        http.get('label', {
            success: res => {
                var data = res.c_types
                for (let i = 0; i < data.length; i++) {
                    data[i].icon = iconUrl + data[i].type_id
                    data[i].num = 0
                    data[i].txtStyle = ""
                    data[i].isTouchMove = false
                }
                that.setData({
                    listData: data,
                    updataTime: res.modified_time.time * 1000
                })
            }
        })
    },
    // 获取收货地址
    address() {
        var that = this
        let user = that.data.userinfo.user_sid
        http.get('adress', {
            data: {
                user_sid: user
            },
            success: res => {
                that.setData({
                    addressType: res.address_exist,
                    takeAddress: res.delivery_info,
                    userinfoId: res.delivery_info.id,
                    tel: that.phone(res.delivery_info.contact_pn)
                })
            }
        })
    },
    // 更新收货地址
    changeAddress(addressName, ids) {
        console.log(ids)
        var that = this
        that.setData({
            "takeAddress.address": addressName.mapaddress,
            "takeAddress.contact": addressName.contact,
            //"takeAddress.contact_pn": addressName.phone,
            "takeAddress.house_number": addressName.house_number,
            addressType: true,
            tel: that.phone(addressName.phone),
            userinfoId: ids


        })
    },
    // 跳转收货地址页
    moveAddress() {
        wx.navigateTo({
            url: '/pages/order/receivingAddress/receivingAddress'
        })
    },
    // 减号按钮
    reduce(e) {
        var that = this
        let index = e.currentTarget.dataset.bindex //当前选中的下标
        let carts = that.data.listData
        let num = carts[index].num

        if (num <= 1) {
            carts[index].num = 0;
            that.setData({
                listData: carts,
            })
        } else {
            num = num - 1;
            carts[index].num = num;
            that.setData({
                listData: carts,
            });
        }

        var sum = 0;
        for (var i = 0; i < carts.length; i++) {
            var QC = carts[i].num;
            sum += parseFloat(QC);
            if (carts[i].num > 0) {
                return false
            }
        }
        that.util('close')
        var price = 0;
        var prices = 0;
        if (sum > 0) {
            for (var i = 0; i < carts.length; i++) {
                price += carts[i].min_price * carts[i].num
                prices += carts[i].max_price * carts[i].num

            }
            price = price.toFixed(2)
            prices = prices.toFixed(2)
        }
        that.setData({
            budgetMoney: price + '-' + prices
        })
    },

    // 增加按钮
    add(e) {
        var that = this;
        const index = e.currentTarget.dataset.bindex;
        let carts = that.data.listData;
        let num = carts[index].num; //数量
        num = num + 1;
        carts[index].num = num;
        that.setData({
            ['listData[' + index + '].num']: num
        });
        var sum = 0;
        for (var i = 0; i < carts.length; i++) {
            var QC = carts[i].num;
            sum += parseFloat(QC);
        }
        var price = 0;
        var prices = 0;
        if (sum > 0) {
            for (var i = 0; i < carts.length; i++) {
                price += carts[i].min_price * carts[i].num
                prices += carts[i].max_price * carts[i].num
            }
            price = price.toFixed(2)
            prices = prices.toFixed(2)
        }
        that.setData({
            budgetMoney: price + '-' + prices
        })
    },

    //删除按钮
    delete_btn(e) {
        var that = this;
        var index = e.currentTarget.dataset.bindex;
        var carts = that.data.listData;
        //移除列表中下标为index的项  
        carts[index].num = 0;
        that.setData({
            ['listData[' + index + '].num']: 0,
        })
        var sum = 0;
        for (var i = 0; i < carts.length; i++) {
            var QC = carts[i].num;
            sum += parseFloat(QC)
            if (carts[i].num > 0) {
                return false
            }
        }
        that.util('close')
        var price = 0;
        var prices = 0;
        if (sum > 0) {
            for (var i = 0; i < carts.length; i++) {
                price += carts[i].min_price * carts[i].num
                prices += carts[i].max_price * carts[i].num
            }
            price = price.toFixed(2)
            prices = prices.toFixed(2)
        }
        that.setData({
            budgetMoney: price + '-' + prices
        })

    },

    // 下单
    placeOrder() {
        var that = this
        let user = that.data.userinfo.user_sid
        var arrow = []
        for (let i = 0; i < that.data.listData.length; i++) {
            if (that.data.listData[i].num > 0) {
                var obj = {}
                obj.p_type = that.data.listData[i].type_id
                obj.quantity = that.data.listData[i].num
                arrow.push(obj)
            }
        }
        if (that.data.addressType == false) {
            dialog.tips('请完善地址(首次下单)')
            setTimeout(function () {
                wx.navigateTo({
                    url: '/pages/order/receivingAddress/receivingAddress'
                })
            }, 1000)
            return false;
        }
        if (user && that.data.userinfoId != '') {
            http.post('order', {
                data: {
                    data: {
                        user_sid: user,
                        type_quantity: arrow ? arrow : [],
                        deli_id: that.data.userinfoId
                    }
                },
                success: (res) => {
                    if (res.result == 200) {
                        console.log(res)
                        dialog.tips('已提交订单，等待确认')

                        setTimeout(function () {
                            wx.navigateBack({
                                url: '/pages/home/home'
                            })
                        }, 1000)
                    } else {
                        dialog.tips(res.result)
                    }
                }
            })
        } else {
            dialog.tips('请求参数有问题')
        }

    },
    // 手机号隐藏部分
    phone(tels) {
        var tel = tels;
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        tel = tel.replace(reg, "$1****$2");
        return tel
    },

    // 选中抽屉列表
    powerDrawer(e) {
        var that = this
        let orderList = that.data.listData
        for (var i = 0; i < orderList.length; i++) {
            if (orderList[i].num > 0) {
                var currentStatu = e.currentTarget.dataset.statu;
                that.util(currentStatu)
            }
        }
    },
    // 抽屉动画
    util(currentStatu) {
        /* 动画部分 */
        var animation = wx.createAnimation({
            duration: 200, //动画时长 
            timingFunction: "linear", //线性 
            delay: 0 //0则不延迟 
        });
        this.animation = animation;
        animation.translateY(240).step();
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation
            })
            //关闭抽屉 
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)
        // 显示抽屉 
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    // 左滑删除
    //手指刚放到屏幕触发
    touchS: function (e) {
        //判断是否只有一个触摸点
        if (e.touches.length == 1) {
            this.setData({
                //记录触摸起始位置的X坐标
                startX: e.touches[0].clientX
            });
        }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function (e) {
        //console.log(e);
        var that = this
        if (e.touches.length == 1) {
            //记录触摸点位置的X坐标
            var moveX = e.touches[0].clientX;
            //计算手指起始点的X坐标与当前触摸点的X坐标的差值
            var disX = that.data.startX - moveX;
            //delBtnWidth 为右侧按钮区域的宽度
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0rpx";
            } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "rpx";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "rpx";
                }
            }
            //获取手指触摸的是哪一个item
            var index = e.currentTarget.dataset.bindex;
            var list = that.data.listData;
            //将拼接好的样式设置到当前item中
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            this.setData({
                listData: list
            });
        }
    },
    touchE: function (e) {
        // console.log(e);
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.bindex;
            var list = that.data.listData;
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            that.setData({
                listData: list
            });
        }
    },
})