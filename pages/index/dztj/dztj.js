// pages/index/dztj/dztj.js
import api from "../../../utils/api"
import {
  baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isRequest: false,
    pageNum: 1,
    id : ''
  },
  inputValue(e) {
    this.setData({
      history: e.detail.value.trim()
    })
  },
  clear() {
    this.setData({
      history: ''
    })
  },
  searchResult() {
    this.setData({
      list: [],
      pageNum: 1,
      isRequest: false
    })
    this.search()
  },
  search() {
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.buildinglList({
      areaCode: wx.getStorageSync('areaCode'),
      merchantType: this.data.type,
      allianceId : this.data.id,
      history: this.data.history,
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(res => {
      const data = res.data
      wx.hideLoading({})
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        list: [...arr, ...data.list],
        isRequest: false
      })
    })
  },
  // 商品详情
  detail(e) {
    const id = app.getValue(e).id
    wx.navigateTo({
      url: `/pages/goodsDe/index?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({
      type,
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
      pageNum: 1,
      isRequest: false
    })
    this.search()
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
        this.search()
      } else {

      }
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})