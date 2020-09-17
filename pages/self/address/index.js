// pages/self/address/index.js
import api from "../../../utils/api"
/* import {
  baseURL
} from "../../../utils/http" */
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag : false,
    list: [],
    isRequest: false,
    pageNum: 1,
    isClick: false
  },
  // 新增收货地址
  add() {
    wx.navigateTo({
      url: '/pages/self/address/add/index',
    })
  },
  noclick () {

  },
  // 选择收货地址
  select(e){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    const index = app.getValue(e).index
    // console.log(id)
    prevPage.setData({
      address: this.data.list[index]
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 编辑
  edit(e) {
    const id = app.getValue(e).id
    wx.navigateTo({
      url: `/pages/self/address/edit/index?id=${id}`,
    })
  },
  // 收货地址列表
  addressList() {
    let arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.addressList({
      userId: wx.getStorageSync('userId'),
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.flag) {
      this.setData({
        flag : true
      })
    }
    if (options.from !== '') {
      this.setData({
        isClick: true
      })
    } else {
      this.setData({
        isClick: false
      })
    }
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
      pageNum: 1
    })
    this.addressList()
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
        this.addressList()
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