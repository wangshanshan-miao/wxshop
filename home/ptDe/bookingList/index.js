// pages/ptDe/bookingList/index.js
import api from "../../../utils/api"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../../utils/http"
let timer
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    mask: false,
    list: [],
    isRequest: false,
    pageNum: 1,
    selectIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  reduce() {
    const self = this
    timer = setInterval(() => {
      let endTime = this.data.endTime
      let diff = endTime - new Date().getTime()
      if (diff <= 0) {
        clearInterval(timer)
        self.setData({
          diff: false
        })
        return
      }
      self.setData({
        nowTime: new Date().getTime()
      })
    }, 1000);
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
      baseURL,
      imgBaseUrl,
      userId: wx.getStorageSync('userId'),
      nowTime: new Date().getTime(),
      imgUrl
    })
    this.reduce()
  },
  // 去拼团
  goBooking(e) {
    const index = app.getValue(e).index
    const groupType = app.getValue(e).type
    console.log(groupType)
    this.setData({
      groupType
    })
    // console.log(index)
    let arr = this.data.list
    let userIds = arr[index].userIds
    const bookingId = arr[index].bookingId
    const groupUserId = arr[index].groupUserId
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
        userIds,
        selectIndex: index
      })
    })
  },
  closeModal() {
    this.setData({
      modal: false,
      mask: false
    })
  },
  // 参与
  booking() {
    api.createCommodityOrder({
      orderType: 1,
      bookingId: this.data.bookingId,
      groupUserId: this.data.groupUserId
    }).then(res => {
      console.log(res)
      if (res.status == 500) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }

      let id = res.data.orderId
      wx.navigateTo({
        url: `/pages/self/ptDetail/index?id=${id}`,
      })
    })
    return false;
    api.addGroupBooking({
      bookingId: this.data.bookingId,
      groupUserId: this.data.groupUserId
    }).then(res => {
      console.log(res)
      this.closeModal()
      if (res.status == 200) {
        this.setData({
          list: [],
          pageNum: 1,
          isRequest: false
        })
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        this.bookingList()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 拼团列表
  bookingList() {
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    api.groupUserList({
      bookingId: this.data.id,
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(res => {
      // console.log(res)
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
        this.bookingList()
      } else {

      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      list: [],
      pageNum: 1,
      isRequest: false
    })
    this.bookingList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})