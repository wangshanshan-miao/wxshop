/*
 * @Descripttion: 前端开发
 * @version: 1.0
 * @Author: ls
 * @Date: 2020-05-19 16:54:54
 * @LastEditors: ls
 * @LastEditTime: 2020-08-10 15:26:27
 */
// pages/self/cooperation/index.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../utils/http"
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        phoneNumber: ''
    },
    // 拨打电话
    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    },
    cooperation() {
        api.cooperation().then(res => {
            if (res.status == 200) {
                const data = res.data
                this.setData({
                    phone: data.phone,
                    content: data.content,
                    img: data.rulesImg
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl,
            imgUrl
        })
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
        this.cooperation()
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