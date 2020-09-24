// pages/self/invite/list/index.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isRequest: false,
    pageNum: 1
  },
  getList() {
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.inviterList({
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(res => {
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
    this.setData({
      list: [],
      pageNum: 1,
      isRequest: false
    })
    this.getList()
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
        this.getList()
      } else {

      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})