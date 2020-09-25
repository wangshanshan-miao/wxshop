// pages/talk/index.js
import api from "../../utils/api"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../utils/http"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleContent: '', //文章正文
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  getEditorValue(e) {
    this.setData({
      articleContent: e.detail.text
    })
  },
  onStatusChange(e) {
    debugger
    const formats = e.detail
    this.setData({ formats })
  },
  sendTalk () {
    debugger
    api.addTalk({
      // outId: this.data.id
      userId: wx.getStorageSync("userId"),
      // userId: 81,
      merchantId: wx.getStorageSync("merchantId"),
      content: this.data.articleContent
    }).then(res => {
      if (res.status == 200) {
        wx.showToast({
          title: '留言成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,  // 返回上一级页面。
          success: function () {
            console.log('成功！')
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
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