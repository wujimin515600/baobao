import dialog from '../../utils/dialog'
import user from '../../utils/user'
import http from '../../utils/http'
var money = []
Page({
    data: {
        userinfo: {},
        addressType: false,
        takeAddress: {},
        timeList: [],
        selectTime: {
            str: "",
            value: false
        },
        showModalStatus: false,
        showModaltimeStatus: false,
        allprice1: 0,
        allprice2: 0,
        addorder: [],
        cator: [],
        currentTab: 0,
        format_labek: [{
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }, {
            labek: [{
                weight1: '20',
                weight2: '30',
                value: '0',
                checked: false,
            }, {
                weight1: '30',
                weight2: '60 ',
                value: '1',
                checked: false
            }, {
                weight1: '60',
                weight2: '120',
                value: '2',
                checked: false
            }, {
                weight1: '120',
                value: '3',
                checked: false
            }]
        }]
    },
    onLoad(e) {

    },
    onShow() {
        var that = this
        that.setData({
            userinfo: user.info()
        });
        that.address()
        that.catorlist()
        that.order_time()
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
    // 手机号隐藏部分
    phone(tels) {
        var tel = tels;
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        tel = tel.replace(reg, "$1****$2");
        return tel
    },
    // 选中抽屉列表
    powerDrawer(e) {
        let that = this
        var currentStatu = e.currentTarget.dataset.statu;
        let type = e.currentTarget.dataset.type

        that.util(currentStatu, type)
    },
    // 抽屉动画
    util(currentStatu, type) {
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
                var cator = this.data.cator
                var checkboxArr = this.data.format_labek;
                this.setData({
                    showModalStatus: false,
                    showModaltimeStatus: false
                });
            }
        }.bind(this), 200)

        // 显示抽屉 
        if (currentStatu == "open" && type == 'price') {
            console.log(1)
            this.setData({
                showModalStatus: true
            });
        } else if (currentStatu == "open" && type == 'times') {
            console.log(2)
            this.setData({
                showModaltimeStatus: true
            });
        }
    },
    clicks(e) {
        let that = this
        var index = e.currentTarget.dataset.current; //获取当前点击的下标
        let indexid = e.currentTarget.dataset.index
        var checkboxArr = that.data.cator; //选项集合
        let format_labek = this.data.format_labek

        for (let i = 0; i < checkboxArr.length; i++) {
            if (checkboxArr[i].id == index.id) {
                checkboxArr[i].checked = true; //改变当前选中的checked值
            } else {
                let flag = false
                if (format_labek[i] && format_labek[i].labek) {
                    format_labek[i].labek.forEach(e => {
                        if (e.checked == true) flag = true
                    })
                    checkboxArr[i].checked = flag
                }
            }
        }
        that.setData({
            cator: checkboxArr,
            currentTab: indexid
        })
    },
    format_click(e) {
        var that = this
        var index = e.currentTarget.dataset.index, //获取当前点击的下标
            subidx = e.currentTarget.dataset.subidx
        var checkbox = that.data.format_labek; //选项集合
        var catordata = that.data.cator; //选项集合

        checkbox[index].labek.forEach(items => {
            items.checked = false
        })
        checkbox[index].labek[subidx].checked = true
        // 算钱
        // let unitprice = catordata[index].price.toFixed(2)

        // let weight3 = (unitprice * checkbox[index].labek[subidx].weight1).toFixed(2)
        // let weight4 = (unitprice * checkbox[index].labek[subidx].weight2).toFixed(2)

        // let obj = {
        //     weight1: weight3,
        //     weight2: weight4
        // }

        money.push(checkbox[index].labek[subidx])
        // var allprice1 = 0
        // var allprice2 = 0
        // for (let index = 0; index < money.length; index++) {
        //     allprice1 += money[index].weight1++
        //     allprice2 += money[index].weight2++
        // }
        // var allprice = allprice1 + '-' + allprice2
        that.setData({
            // budgetMoney: allprice,
            format_labek: checkbox
        });
        this.calculate()
    },
    calculate() {
        var checkboxArr = this.data.cator; //选项集合
        var wegiht = this.data.format_labek;

        let addorder = []
        for (let index = 0; index < checkboxArr.length; index++) {
            if (checkboxArr[index].checked == true) {
                let name = checkboxArr[index].name
                for (let i = 0; i < wegiht[index].labek.length; i++) {
                    if (wegiht[index].labek[i].checked == true) {
                        let weight1 = wegiht[index].labek[i].weight1 ? wegiht[index].labek[i].weight1 : ''
                        let weight2 = wegiht[index].labek[i].weight2 ? wegiht[index].labek[i].weight2 : ''
                        let id = checkboxArr[index].id

                        let weight = ''
                      console.log('ok', typeof(checkboxArr[index].price))
                      let unitPrice = Number(checkboxArr[index].price).toFixed(2)
                      
                        let price = ''
                        let price1 = ''
                        if (weight2) {
                            price = (unitPrice * weight1).toFixed(2)
                            price1 = (unitPrice * weight2).toFixed(2)
                            weight = weight1 + '-' + weight2
                        } else {
                            price = (unitPrice * weight1).toFixed(2)
                            weight = weight1
                        }

                        addorder.push({
                            name,
                            "p_type": id,
                            "quantity": weight1,
                            "quantity_max": weight2 || null,
                            price,
                            price1,
                            index
                        })

                    };
                }
            }
        }

        var allprice1 = 0
        var allprice2 = 0
        let flag = false

        for (let index = 0; index < addorder.length; index++) {
            allprice1 += Number(addorder[index].price)
            allprice2 += Number(addorder[index].price1)

            if (!addorder[index].price1) {
                flag = true
            }
        }

        this.setData({
            addorder,
            allprice1,
            allprice2: flag ? false : allprice2
        })
    },
    //  添加列表
    addorder() {
        if (this.data.addorder.length > 0) {
            this.util('close')
        } else {
            dialog.tips('请完成添加')
        }
    },
    // 删除
    delorder(e) {
        let carts = this.data.addorder
        let index = e.currentTarget.dataset.bindex,
            catoridx = e.currentTarget.dataset.catoridx
        console.log(catoridx);


        var checkboxArr = this.data.cator; //选项集合
        var wegiht = this.data.format_labek;
        console.log(checkboxArr);

        checkboxArr[catoridx].checked = false

        wegiht[catoridx].labek.forEach(element => {
            element.checked = false
        });

        carts.splice(index, 1)

        this.setData({
            format_labek: wegiht,
            cator: checkboxArr,
            addorder: carts
        })
        this.calculate()

    },
    // 获取下单时间
    order_time() {
        let that = this
        let user = that.data.userinfo.user_sid
        http.get('picking_time', {
            data: {
                user_sid: user,
            },
            success: res => {
                let timeList = [
                    [],
                    []
                ]
                res.picking_time.forEach((i, index) => {
                    console.log(i);

                    timeList[0].push({
                        str: i.day,
                        value: i.day,
                        list: []
                    })

                    i.time_list.forEach(j => {
                        let obj = {
                            str: j.time,
                            value: j.order_picking_time
                        }

                        timeList[0][index].list.push(obj)
                    });
                })

                timeList[1] = timeList[0][0].list
                console.log(timeList);

                that.setData({
                    timeList
                })
            },
            fail: res => {
                dialog.tips(res.result);
            }
        })
    },
    bindMultiPickerChange(e) {
        let timeList = this.data.timeList
        let value = e.detail.value
        console.log(timeList[0][value[0]].str);
        console.log(timeList[1][value[1]].str);
        this.setData({
            selectTime: {
                str: timeList[0][value[0]].str + " " + timeList[1][value[1]].str,
                value: timeList[1][value[1]].value
            }
        })
    },
    bindMultiPickerColumnChange(e) {
        let detail = e.detail

        if (detail.column == 0) {
            let timeList = this.data.timeList

            timeList[1] = timeList[0][detail.value].list

            this.setData({
                timeList
            })
        }
    },
    linkAgreement() {
        wx.navigateTo({
            url: '/pages/agreement/agreement'
        })
    },
    // 获取品类
    catorlist() {
        let that = this
        let user = that.data.userinfo.user_sid
        http.get('ordercate', {
            data: {
                // user_sid: user,
                // operator: 0
              price_type:'flow',
              operator:'0'
            },
            success: res => {
                let data = res.categories
                data.forEach((item, index) => {
                    item.checked = false
                    item.value = index
                    item.name = item.t_top_name
                })
                that.setData({
                    cator: data
                })
            },
            fail: res => {
                dialog.tips(res.result);
            }
        })
    },
    // 下单
    placeOrder() {
        let that = this
        let user = that.data.userinfo.user_sid
        let orderlist = that.data.addorder

        let picking = that.data.selectTime.value

        let id = that.data.userinfoId
        let addstu = that.data.addressType
        console.log(picking);
        if (picking === false) {
            dialog.tips('请填写预约时间');
            return false
        } else if (!id) {
            dialog.tips('请填写收货地址');
        } else if (addstu == false) {
            dialog.tips('请完善地址(首次下单)')
            setTimeout(function () {
                wx.reLaunch({
                    url: '/pages/order/receivingAddress/receivingAddress'
                })
            }, 1000)
            return false;
        } else {
            http.post('neworder', {
                data: {
                    data: {
                        user_sid: user,
                        customer_appraisal: orderlist,
                        order_picking_time: picking,
                        deli_id: id
                    }
                },
                success: res => {
                    if (res.result == 200) {
                        console.log(res)
                        dialog.tips('已提交订单，等待确认')

                        setTimeout(function () {
                            wx.reLaunch({
                                url: '/pages/home/home'
                            })
                        }, 1000)
                    } else {
                        dialog.tips(res.result)
                    }
                },
                fail: res => {
                    dialog.tips(res.result);
                }
            })
        }
    }
})