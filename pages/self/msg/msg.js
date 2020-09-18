// pages/self/evaluate/evaluate.js
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
    tabs: ['全部', '未回复', '已回复'],
    active: 0
  },
  // 评价列表
  msgList() {
    api.feedbackList({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        list: data.list
      })
    })
  },
  clickTab(e) {
    const index = app.getValue(e).index
    this.setData({
      active: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseURL,
      imgBaseUrl,
      orderId: options.id,
      active: 1
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