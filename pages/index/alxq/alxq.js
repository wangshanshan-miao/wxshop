/*
 * @Descripttion: 前端开发
 * @version: 1.0
 * @Author: ls
 * @Date: 2020-05-19 16:54:54
 * @LastEditors: ls
 * @LastEditTime: 2020-08-10 15:21:57
 */
// pages/index/alxq/alxq.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http"
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },
    // 预览
    preview(e) {
        const url = app.getValue(e).url
        console.log(url)
        wx.previewImage({
            current: imgBaseUrl + url, // 当前显示图片的http链接
            urls: [imgBaseUrl + url] // 需要预览的图片http链接列表
        })
    },
    detail() {
        api.caseDetail({
            caseId: this.data.id
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                url: data.logoUrl,
                name: data.merchantName,
                time: data.createTime,
                imgs: data.urlList,
                content: data.content,
                merchantId: data.merchantId
            })
        })
    },
    goSotre() {
        const id = this.data.merchantId
        wx.navigateTo({
            url: `/pages/store/store?id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl,
            id: options.id
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
        this.detail()
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