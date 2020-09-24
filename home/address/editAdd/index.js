// pages/address/editAdd/index.js
import api from "../../../utils/api"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../../utils/http"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    isMo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl
    })
  },
  // 保存收货地址
  save() {
    const codeName = this.data.codeName
    const addressPhone = this.data.addressPhone
    const addressName = this.data.addressName
    const receiverAddress = this.data.receiverAddress
    if (!(codeName && addressPhone && addressName && receiverAddress)) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return false
    }
    
    api.addAddress({
      userId: wx.getStorageSync('userId'),
      areaCode: this.data.areaCode,
      addressName,
      addressPhone,
      codeName,
      receiverAddress,
      def: 1
    }).then(res => {
      if (res.status == 200 && res.data == 1) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        // 新增之后去选择收货地址
        wx.navigateTo({
          url: '../list/index',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 是否设为默认地址
  setAdd () {
    this.setData({
      isMo: !this.data.isMo
    })
  },
  // 选择区域
  selectArea(e) {
    let code = e.detail.code.pop()
    this.setData({
      region: e.detail.value,
      areaCode: code,
      codeName: e.detail.value.join("")
    })
  },
  checkPhone(e) {
    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    if (reg.test(e.detail.value)) {
      this.setData({
        addressPhone: e.detail.value
      })
    } else {
      this.setData({
        addressPhone: ''
      })
    }
  },
  inputAddress(e) {
    debugger
    this.setData({
      receiverAddress: e.detail.value.trim()
    })
  },
  inputName(e) {
    this.setData({
      addressName: e.detail.value.trim()
    })
  },
  // 确认收货地址
  confirm() {
    const addressId = this.data.addressId
    if (!addressId) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    this.closeAddress()
    this.createMetricalOrder()
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