// pages/self/evaluate/evaluate.js
import api from "../../utils/api"
import {
  baseURL,
  imgBaseUrl
} from "../../utils/http"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      name: '全部',
      status: ''
    }, {
      name: '未回复',
      status: 0
    }, {
      name: '已回复',
      status: 1
    }],
    active: 0
  },
  // 评价列表
  msgList() {
    const feedbackType = this.data.feedbackType
    api.msgList({
      userId: wx.getStorageSync('userId'),
      feedbackType
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        list: data.list
      })
    })
  },
  // 留言详情
  toDetail (e) {
    const feedbackId = app.getValue(e).id
    wx:wx.navigateTo({
      url: '../msgDetail/index?feedbackId=' + feedbackId,
    })
  },
  // 切换tab
  clickTab(e) {
    const index = app.getValue(e).index
    const status = app.getValue(e).status
    this.setData({
      active: index,
      feedbackType: status
    })
    this.msgList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseURL,
      imgBaseUrl,
      orderId: options.id
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
    debugger
    this.msgList()
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