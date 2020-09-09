// pages/self/pay/index.js
import api from "../../../utils/api"
const app = getApp()
let timer
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    modal : false,
    phone:false, // 验证手机弹框
  },
  showModal(){
    this.setData({
      phone: true,
      modal: true
    })
  },
  closePhone() {
    this.setData({
      phone: false,
      modal: false
    })
  },
  // 检测手机
  checkPhone() {
    let tel = wx.getStorageSync('tel')
    if (!tel) {
      api.checkPhone().then(res => {
        console.log(res)
        const data = res.data
        if (data) {
          wx.setStorageSync('tel', true)
          this.pay()
        }else{
          this.showModal()
        }
      })
    }else{
      this.pay()
    }
  },
  // 获取手机
  getPhoneNumber(e) {
    const res = e.detail
    if (res.errMsg == "getPhoneNumber:ok") {
      this.setData({
        iv: res.iv,
        encryptedData: res.encryptedData
      })
      this.getUserPhone()
    }
    this.closePhone()
  },
  // 获取用户手机号
  getUserPhone() {
    const self = this
    api.getUserPhone({
      encryptDataB64: this.data.encryptedData,
      ivB64: this.data.iv,
      sessionKeyB64: wx.getStorageSync('session_key')
    }).then(res => {
      // console.log(res)
      const data = res.data
      if (res.status == 200) {
        const phone = JSON.parse(data).phoneNumber
        api.updateUserDetail({
          userPhone: phone
        }).then(res => {
          console.log(res)
          if (res.data == 1) {
            wx.setStorageSync('tel', true)
            self.pay()
          }
        })
      }
    })
  },
  // 订单详情
  orderDetail() {
    api.orderDetail({
      orderId: this.data.id
    }).then(res => {
      const data = res.data
      this.setData({
        endTime: data.order.endTime, // 剩余支付时间
        totalPrices: data.order.totalPrices // 总计
      })
    })
  },
  // 支付订单
  pay() {
    api.settleCommodityOrder({
      orderId: this.data.id,
      addressId: this.data.addressId,
      userVoucherId: this.data.voucherId
    }).then(res => {
      console.log(res)
      if (res.status == 200) {
        const data = res.data
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success(res) {
            wx.navigateBack({
              complete: (res) => {},
            })
          },
          fail(res) {}
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon : 'none'
        })
      }
    })
  },
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
        // 订单剩余支付时间结束
        wx.navigateBack({
          complete: (res) => {},
        })
        return
      }
      self.setData({
        nowTime: new Date().getTime()
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      total: options.total,
      voucherId: options.voucherId,
      addressId: options.addressId,
      nowTime: new Date().getTime()
    })
    this.reduce()
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