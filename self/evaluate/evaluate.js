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
      name: '待评价',
      status: 7
    }, {
      name: '已评价',
      status: 8
    }],
    active: 0
  },
  // 评价列表
  evaDetail () {
    const orderStatus = this.data.orderStatus
    const outIds = []
    api.evaList({
      orderId: this.data.orderId,
      orderStatus
    }).then(res => {
      // console.log(res)
      const data = res.data
      for (var i in data.orderCommodityDtoList) {
        outIds[i] = data.orderCommodityDtoList[i].outId
      }
      this.setData({
        list: data.orderCommodityDtoList,
        outId: outIds
      })
    })
  },
  clickTab (e) {
    const index = app.getValue(e).index
    const status = app.getValue(e).status
    this.setData({
      active: index,
      orderStatus: status
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
      active: 1,
      orderStatus: 8
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
    this.evaDetail()
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