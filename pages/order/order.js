// pages/order/order.js
import api from "../../utils/api"
import {
  baseURL,
  imgBaseUrl
} from "../../utils/http"
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    orderId: '',
    hasAddress: false,
    addressShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.address)
    this.setData({
      detail: JSON.parse(decodeURIComponent(options.detail)),
      orderId: options.orderId,
      num: options.num,
      guige: JSON.parse(decodeURIComponent(options.guige)),
      baseURL,
      imgBaseUrl
    })
    console.log(this.data.detail.coverUrl)
    this.getAddress()
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
  // 获取收货地址
  getAddress () {
    api.getAddressList({
      userId: wx.getStorageSync('userId')
      // userId: '81'
    }).then(res => {
      this.setData({
        addressList: res.data.list
      })
      if (this.data.addressList.length > 0) {
        this.data.addressList.map(item =>{
          if (item.def == 1) {
            this.setData({
              hasAddress: true,
              address: item
            })
          }
        })
      }
    })
  },

  // 前往列表页
  toList () {
    wx.navigateTo({
      url: '../self/address/index?form="order"',
    })
  },

  // 新增收货地址
  newAdd () {
    wx.navigateTo({
      url: '../self/address/add/index?form="order"',
    })
  },
  
  // 提交订单
  submit () {
    let params
    if (this.data.voucherId) {
      params = {
        orderId: this.data.orderId,
        addressId: this.data.address.addressId,
        userVoucherId: this.data.voucherId,
        userId: wx.getStorageSync('userId')
      }
    } else {
      params = {
        orderId: this.data.orderId,
        addressId: this.data.address.addressId,
        userId: wx.getStorageSync('userId')
      }
    }
    api.settleCommodityOrder(params).then(res => {
      console.log(res)
      if (res.status == 200) {
        const data = res.data
        wx.showToast({
          title: res.data,
          icon: 'none'
        })
        // wx.requestPayment({
        //   timeStamp: data.timeStamp,
        //   nonceStr: data.nonceStr,
        //   package: data.package,
        //   signType: 'MD5',
        //   paySign: data.paySign,
        //   success(res) {
        //     wx.navigateBack({
        //       complete: (res) => { },
        //     })
        //   },
        //   fail(res) { }
        // })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
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