// pages/self/refund/index.js
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
    returnReason: '',
    problemDescription: "",
    evaluateUrl: [],
    arr: []
  },
  deleteImg(e){
    const index = app.getValue(e).i
    let arr = this.data.arr
    arr.splice(index,1)
    let arr1 = this.data.evaluateUrl
    arr1.splice(index,1)

    this.setData({
      arr : arr,
      evaluateUrl : arr1
    })
  },
  // 退款原因
  inputReason(e) {
    this.setData({
      returnReason: e.detail.value.trim()
    })
  },
  // 问题描述
  inputDescript(e) {
    this.setData({
      problemDescription: e.detail.value.trim()
    })
  },
  // 订单详情
  orderDetail() {
    api.orderDetail({
      orderId: this.data.orderId
    }).then(res => {
      // console.log(res.data.order)
      const data = res.data
      this.setData({
        detail: data.order
      })
    })
  },
  // 上传凭证
  upload() {
    const self = this
    const num = this.data.evaluateUrl.length
    // console.log(num)
    // let newArr = []
    wx.chooseImage({
      count: 3 - num,
      success(res) {
        const arr = res.tempFilePaths
        self.setData({
          arr: [...self.data.arr,...arr]
        })
        for (let i = 0; i < arr.length; i++) {
          wx.uploadFile({
            url: baseURL + 'api/common/ImgUpload',
            filePath: arr[i],
            name: 'file',
            success(res) {
              const data = res.data
              const result = JSON.parse(data).data.filePath
              // console.log(result)
              // newArr.push(result)
              self.setData({
                evaluateUrl :[...self.data.evaluateUrl,result]
              })
            }
          })
        }
      }
    })
    
  },
  // 退款原因
  inputReason(e) {
    this.setData({
      returnReason: e.detail.value.trim()
    })
  },
  // 退款
  refound() {
    const returnReason = this.data.returnReason
    const problemDescription = this.data.problemDescription
    const salesReturnUrl = this.data.evaluateUrl.join(',')
    if (!returnReason || !problemDescription || !salesReturnUrl) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return false;
    }
    api.delCommodityOrder({
      orderId: this.data.orderId,
      orderStatus: 2,
      returnReason,
      problemDescription,
      salesReturnUrl
    }).then(res => {
      // console.log(res)
      if (res.status == 200) {
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
      orderId: options.id
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