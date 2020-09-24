/**
 * index.js
 */
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
    value: ''
  },
  // 输入内容
  input(e) {
    // console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  // 清除搜索内容
  clearAll() {
    this.setData({
      value: "",
      arr: []
    })
  },
  // 点击搜索历史标签
  handleTap(e) {
    const content = e.currentTarget.dataset.content
    api.searchResult({
      merchantId: wx.getStorageSync('merchantId'),
      userId: wx.getStorageSync('userId'),
      history: content
    }).then(res => {
      // console.log(res)
      this.setData({
        arr: res.data.list,
        value: content
      })
    })
  },
  // 搜索结果
  searchResult() {
    const value = this.data.value.trim()
    if (value != "") {
      api.searchResult({
        userId: wx.getStorageSync('userId'),
        history: value,
        merchantId: wx.getStorageSync('merchantId')
      }).then(res => {
        // console.log(res)
        if (res.status == 200) {
          this.setData({
            arr: res.data.list
          })
          if (res.data.list.length == 0) {
            wx.showToast({
              title: '没有搜索到任何内容~',
              icon: "none"
            })
          }
          this.history()
        }
      })
    } else {
      wx.showToast({
        title: '请输入搜素内容',
        icon: "none"
      })
    }
  },
  // 搜索历史
  history() {
    api.searchHistory({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log(res)
      this.setData({
        historyArr: res.data
      })
    })
  },
  // 清除搜索历史
  clearHistory() {
    const self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除所有搜索记录吗？',
      success(res) {
        if (res.confirm) {
          api.clearHistory({
            userId: wx.getStorageSync('userId')
          }).then(res => {
            // console.log(res)
            if (res.status == 200) {
              self.setData({
                historyArr: []
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  // 查看商品详情
  detail(e) {
    const id = e.currentTarget.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: `/pages/goodsDe/index?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        baseURL,
        imgBaseUrl,
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
    this.history()
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