import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../utils/http"
// pages/alleva/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    totalPage: 1,
    isRequest: false,
    array: 5
  },
  // 全部评价
  comments() {
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.comments({
      commodityId: this.data.id,
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(res => {
      console.log(res)
      const data = res.data
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        list: [...arr, ...data.list],
        isRequest: false
      })
      wx.hideLoading({})
    })
  },
  onReachBottom() {
    const isRequest = this.data.isRequest
    const pageNum = this.data.pageNum
    const totalPage = this.data.totalPage
    // 当前页数小于总页数
    if (pageNum < totalPage) {
      if (!isRequest) {
        this.setData({
          pageNum: pageNum + 1,
          isRequest: true
        })
        this.comments()
      } else {

      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id : options.id,
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
    this.setData({
      list: [],
      pageNum: 1
    })
    this.comments()
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