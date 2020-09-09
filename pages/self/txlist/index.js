// pages/self/txlist/index.js
import api from "../../../utils/api"
let app =  getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        expendList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.expend();
    },
    // 提现
    tx(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/self/txjg/index?id=${id}`,
        })
    },
    // 支出
    expend() {
        api.commissionList({
            userId: wx.getStorageSync('userId'),
            commissionType: 1,
            pageNum: 1,
            pageSize: 99
        }).then(res => {
            this.setData({
                expendList: res.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})