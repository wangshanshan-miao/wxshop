// pages/self/evaluate/evaluate.js
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
    tabs: [{
      name: '待评价',
      status: 7
    }, {
      name: '已评价',
      status: 8
    }],
    active: 0,
    array: 5
  },
  // 评价列表
  evaDetail () {
    const orderStatus = this.data.orderStatus
    const outIds = []
    api.getEvaluateList({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      // console.log(res)
      const data = res.data
      for (var i in data.list) {
        outIds[i] = data.list[i].outId
      }
      this.setData({
        list: data.list,
        outId: outIds,
        orderList: data
      })
    })
  },
  // 未评价列表
  orderList() {
    let orderStatus = this.data.orderStatus
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.orderList({
      userId: wx.getStorageSync('userId'),
      buyType: 1, // 普通订单
      pageNum: this.data.pageNum,
      pageSize: 10,
      orderStatus // 订单状态
    }).then(res => {
      wx.hideLoading({})
      // console.log(res)
      const data = res.data
      let list = []
      if (data.list.length > 0) {
        list = [...arr, ...data.list]
        list.forEach(m => {
          let sum = 0
          m.orderCommodityDtoList.forEach(n => {
            sum = sum + n.amount * n.realPrice
          })
          m.totalPrice = sum
        })
      }
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        list: list,
        isRequest: false
      })
    })
  },
  // 去评价
  goComment(e) {
    const id = app.getValue(e).id
    wx.navigateTo({
      url: `/self/comment/index.js?id=${id}`,
    })
  },
  // 去评价
  goComment(e) {
    const id = app.getValue(e).id
    wx.navigateTo({
      url: `/self/comment/index.js?id=${id}`,
    })
  },
  clickTab (e) {
    const index = app.getValue(e).index
    const status = app.getValue(e).status
    this.setData({
      active: index,
      orderStatus: status
    })
    if (status == 7) {
      this.orderList()
    } else {
      this.evaDetail()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseURL,
      imgBaseUrl,
      active: 0,
      orderStatus: 7,
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
    this.orderList()
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