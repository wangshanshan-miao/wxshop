// pages/self/comment/index.js.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    evaluateUrl: '',
    list: []
  },
  // 订单详情
  orderDetail() {
    api.orderDetail({
      orderId: this.data.id
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        list: data.orderDto.orderCommodityDtoList
      })
    })
  },
  // 输入
  inputValue(e) {
    this.setData({
      evaluateContent: e.detail.value.trim()
    })
  },
  // 上传图片
  upload() {
    const self = this
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: baseURL + 'api/common/ImgUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const result = JSON.parse(data).data.filePath
            // console.log(result)
            self.setData({
              evaluateUrl: result
            })
          }
        })
      }
    })
  },
  // 提交
  submit() {
    const evaluateContent = this.data.evaluateContent
    if (!evaluateContent) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      })
      return false
    }
    api.addEvaluate({
      userId: wx.getStorageSync('userId'),
      orderId: this.data.id,
      evaluateContent,
      evaluateUrl: this.data.evaluateUrl
    }).then(res => {
      // console.log(res)
      if (res.status == 200) {
        wx.showToast({
          title: '评价成功',
          icon: "none"
        })
        wx.navigateBack({
          complete: (res) => {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        baseURL,
        imgBaseUrl,
      id: options.id
    })
  },
  // 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.orderDetail()
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