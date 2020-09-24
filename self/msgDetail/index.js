// pages/self/msgDetail/index.js
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

  },

  msgDetail () {
    api.msgDetail({
      feedbackId: this.data.feedbackId
    }).then(res => {
      if (res.status == 200) {
        this.setData({
          msg: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      baseURL,
      imgBaseUrl,
      feedbackId: options.feedbackId,
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
    this.msgDetail()
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