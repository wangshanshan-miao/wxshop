// pages/self/fx/fx.js
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

  },
  detail() {
    api.commissionDetail({
      commissionId: this.data.id
    }).then(res => {
      // console.log(res)
      if (res.status == 200) {
        const data = res.data
        this.setData({
          count : data.count,
          createTime : data.createTime,
          headUrl : data.headUrl,
          money : data.money,
          totalPrices : data.totalPrices,
          userName : data.userName,
          userPhone : data.userPhone,
          updateTime : data.updateTime
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
        baseURL,
        imgBaseUrl
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