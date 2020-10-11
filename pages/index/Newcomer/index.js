// pages/index/Newcomer/index.js
//获取应用实例
import api from "../../../utils/api.js"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../../utils/http.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl
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

  },
  lower() {
    if (this.data.totalPage != this.data.pageNum) {
      this.getList()
    }
  },
  getList() {
    api.getVoucherList1({
      useType: 0,
      merchantId: wx.getStorageSync('merchantId')
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        couponList: [...this.data.couponList, ...data.list],
        isRequest: false
      })
      wx.hideLoading({})

    })
  },
  //去用券
  usequan () {
    wx.switchTab({
      url: `/pages/index/index/index`,
    })
  },
  // 领取
  receive() {
    wx.showLoading({
      title: '',
    })
    api.getVoucherToUser({
      areaCode: wx.getStorageSync('shortAreaCode'),
      // areaCode: '420117',
      userId: wx.getStorageSync("userId"),
      merchantId: wx.getStorageSync('merchantId')
      // userId: '81'
    }).then(res => {
      wx.hideLoading()
      if (res.data.status === 1) {
        wx.showToast({
          title: '领取成功！',
          icon: "success",
          duration: 2000,
          complete: () => {
            wx.navigateTo({
              url: `/self/yhq/yhq`,
            })
          }
        })
      }
      wx.showToast({
        title: res.data.message,
      })
    })
  }
})