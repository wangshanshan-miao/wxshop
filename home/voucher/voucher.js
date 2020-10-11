// pages/voucher/voucher.js
import api from "../../utils/api"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    reason: '',
    verificationCode: ''
  },
  // 关闭弹框
  closeModal() {
    this.setData({
      show: false
    })
  },
  inputCode(e) {
    this.setData({
      verificationCode: e.detail.value.trim()
    })
  },
  use() {
    let verificationCode = this.data.verificationCode
    if (!verificationCode) {
      wx.showToast({
        title: '请输入核销码',
        icon: 'none'
      })
      return
    }
    api.userVoucher({
      verificationCode,
      userVoucherId: this.data.id
    }).then(res => {
      console.log(res)
      if (res.data.status == 1) {
        wx.showToast({
          title: '使用成功',
          icon :'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }else if(res.data.status == 0){
        wx.showToast({
          title: res.data.message,
          icon :'none'
        })
      }
    })
  },
  
  voucherDetail() {
    api.voucherDetail({
      userVoucherId: this.data.id
    }).then(res => {
      console.log(res)
      const data = res.data
      this.setData({
        voucherName : data.voucherName,
        sellingPrice: data.sellingPrice, // 销售价格
        voucherPrice: data.voucherPrice // 抵扣价格
      })
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    this.voucherDetail()
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