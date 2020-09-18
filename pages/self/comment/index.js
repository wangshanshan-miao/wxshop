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
    list: [],
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../../img/star1.png',
    selectedSrc: '../../../img/star.png',
    score: [],
    number: 5
  },
  // 订单详情
  orderDetail() {
    api.orderDetail({
      orderId: this.data.id
    }).then(res => {
      // console.log(res)
      const data = res.data
      const outIds = []
      for(var i in data.orderCommodityList) {
        outIds[i]= data.orderCommodityList[i].outId
      }
      this.setData({
        list: data.orderCommodityList,
        outId: outIds
      })
    })
  },
  // 输入
  inputValue(e) {
    const evaluateContents = []
    const index = app.getValue(e).index
    evaluateContents[index] = e.detail.value.trim()
    this.setData({
      evaluateContents
    })
  },
  //点击星星
  selectRight: function (e) {
    const score = []
    const index = app.getValue(e).index
    score[index] = e.currentTarget.dataset.score
    this.setData({
      score: score
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
    const evaluateContent = this.data.evaluateContents
    if (!evaluateContent.length) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      })
      return false
    }
    const id = this.data.id
    api.addEvaluate({
      userId: wx.getStorageSync('userId'),
      orderId: this.data.id,
      evaluateContents: this.data.evaluateContents,
      evaluateLevels: this.data.score,
      outIds: this.data.outId
    }).then(res => {
      // console.log(res)
      if (res.status == 200 && res.data == 1) {
        wx.showToast({
          title: '评价成功',
          icon: "none"
        })
        wx.navigateTo({
          url: `/pages/self/evaluate/evaluate?id=${id}`,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
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