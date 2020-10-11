// home/goodsDe/morePt/index.js
import api from "../../../utils/api"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../../utils/http"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookingId: options.id,
      imgBaseUrl,
      baseURL,
      imgUrl,
      outId: options.outId
    })
    this.getList()
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
    
  },
  // 获取拼团列表
  getList () {
    wx.showLoading({
      title: '加载中...',
    })
    api.groupUserList({
      bookingId: this.data.bookingId
    }).then(res => {
      for(var i =0; i< res.data.list.length; i++) {
        res.data.list[i].endTime = new Date(res.data.list[i].endTime).getTime()
      }
      this.setData({
        list: res.data.list
      })
      let systimestamp = new Date().getTime();
      var _this = this
      this.setData({
        servicetimeInterval: setInterval(function () { // 循环执行
          systimestamp = (systimestamp / 1000 + 1) * 1000;
          _this.setData({
            startTime: systimestamp
          })
        }, 1000)
      })
      wx.hideLoading()
    })
  },
  // 去拼团 弹框
  goBooking(e) {
    wx.showLoading({
      title: '',
    })
    const index = app.getValue(e).index

    let arr = this.data.list
    // let userIds = arr[index].userIds
    const bookingId = arr[index].bookingId
    const groupUserId = arr[index].groupUserId
    const groupType = arr[index].groupType
    const endtimes = arr[index].endTime

    api.getAllGroupUser({
      groupUserId
    }).then(res => {
      console.log(res)
      this.setData({
        groupList: res.data,
        mask: true,
        modal: true,
        bookingId,
        groupUserId,
        // userIds,
        groupType,
        selectIndex: index,
        endtimes
      })
      wx.hideLoading()
      // let systimestamp = new Date().getTime();
      // var _this = this
      // this.setData({
      //   servicetimeInterval: setInterval(function () { // 循环执行
      //     systimestamp = (systimestamp / 1000 + 1) * 1000;
      //     _this.setData({
      //       startTime1: systimestamp
      //     })
      //   }, 1000)
      // })
    })
  },
  // 关闭弹框
  closeModal1() {
    this.setData({
      mask: false,
      modal: false
    })
  },
  // 立即拼团
  booking() {
    wx.showLoading({
      title: '',
    })
    let outIds = []
    outIds.push(this.data.outId)
    api.createCommodityOrder({
      userId: wx.getStorageSync('userId'),
      merchantId: wx.getStorageSync('merchantId'),
      outIds: outIds,
      amounts: [1],
      commoditySpecificationIds: ["-1"],
      groupUserId: this.data.groupUserId
    }).then(res => {
      wx.hideLoading()
      if (res.status == 200 && res.data.status == 1) {
        let id = res.data.orderId
        wx.navigateTo({
          url: `/self/ptDetail/index?id=${id}`,
        })
      }
    })
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