// pages/self/address/index.js
import api from "../../utils/api"
import {
  baseURL,
  imgUrl
} from "../../utils/http"
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
    let from = this.data.from
    wx.navigateTo({
      url: `/self/address/add/index?from=${from}`,
    })
  },
  noclick () {

  },
  // 选择收货地址
  select(e){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let curPage = pages[pages.length - 3];
    const index = app.getValue(e).index
    // console.log(id)
    if (this.data.from == 'list') {
      prevPage.setData({
        address: this.data.list[index],
        hasAddress: true
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      curPage.setData({
        address: this.data.list[index],
        hasAddress: true
      })
      wx.navigateBack({
        delta: 2
      })
    }
    
  },
  // 编辑
  edit(e) {
    const id = app.getValue(e).id
    let from = this.data.from
    wx.navigateTo({
      url: `/self/address/edit/index?id=${id}&from=${from}`,
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
        isClick: true,
        from: options.from
      })
    } else {
      this.setData({
        isClick: false
      })
    }
    this.setData({
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