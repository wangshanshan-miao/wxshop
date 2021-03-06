// pages/index/lghd/lghd.js
import api from "../../../utils/api"
import {
  imgUrl
} from "../../../utils/http"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id : '',
    show: false,
    list: [],
    isRequest: false,
    pageNum: 1
  },
  // 显示弹框
  showModal() {
    this.setData({
      show: true
    })
  },
  // 关闭弹框
  closeModal() {
    this.setData({
      show: false
    })
  },
  // 详情
  detail(e) {
    const id = app.getValue(e).id
    wx.navigateTo({
      url: `/self/yhq/detail/index?id=${id}&state=1`,
    })
  },
  // 代金券列表
  getList() {
    api.getVoucherList1({
      useType: 1,
      merchantId: wx.getStorageSync('merchantId')
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        list: data.list,
        isRequest: false
      })
      wx.hideLoading({})

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id : options.id,
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
      pageNum: 1,
      isRequest: false
    })
    this.getList()
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
  onReachBottom() {
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
        this.getList()
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