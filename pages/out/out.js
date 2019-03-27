//获取应用实例
const app = getApp();
import http from "../../utils/http";
// import tiems from '../../utils/time'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.setData({
            url: e.id
        })
    },

});