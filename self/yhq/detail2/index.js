// pages/self/yhq/detail/index.js
import api from "../../../utils/api"
import {
  imgUrl
} from "../../../utils/http"
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  // 已拥有优惠券详情
  voucherDetail() {
    wx.showLoading({
      title: '',
    })
    api.voucherDetail({
      userVoucherId: this.data.id
    }).then(res => {
      wx.hideLoading()
      // console.log(res)
      const data = res.data
      this.setData({
        returnReason : data.returnReason,
        voucherStatus : data.voucherStatus, // 优惠券状态
        sellingPrice: data.sellingPrice,
        useType: data.useType,
        voucherName: data.voucherName,
        sum: data.sum,
        condition: data.condition,
        details: data.details,
        voucherPrice: data.voucherPrice,
        orderNumber: data.orderNumber,
        userId: data.userId,
        orderTime: data.orderTime,
        buyTime: data.buyTime
      })
    })
  },
  // 核銷
  use() {
    let verificationCode = this.data.verificationCode
    if (!verificationCode) {
      wx.showToast({
        title: '请输入核销码',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '',
    })
    api.userVoucher({
      userId: this.data.userId,
      userVoucherId: this.data.id
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.data.status == 1) {
        wx.showToast({
          title: '使用成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      } else if (res.data.status == 0) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  inputReason(e) {
    this.setData({
      reason: e.detail.value.trim()
    })
  },
  // 显示弹框
  showModal() {
    this.setData({
      show: true
    })
  },
  closeModal(){
    this.setData({
      show : false
    })
  },
  // 退款
  refund() {
    api.backUserVoucher({
      returnReason: this.data.reason,
      userVoucherId: this.data.id
    }).then(res => {
      // console.log(res)
      if (res.status == 200) {
        wx.showToast({
          title: '退款申请成功',
          icon: 'none'
        })
        this.setData({
          show : false
        })
        this.voucherDetail()
      }
    })
  },
  // 删除
  delete() {
    const id = this.data.id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          api.deleteVoucher({
            userVoucherIds: [id]
          }).then(res => {
            // console.log(res)
            if (res.status == 200) {
              wx.navigateBack({
                complete: (res) => {},
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  buy() {
    wx.login({
      success: (res) => {
        api.bugVoucher({
          voucherId: this.data.id,
          weixinCode : res.code
        }).then(res => {
          // console.log(res)
          if (res.status == 200) {
            wx.navigateTo({
              url: `/self/yhq/yhq`,
            })
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      id: options.id,
      state: options.state,
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