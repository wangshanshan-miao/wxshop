// pages/self/yhq/detail/index.js
import api from "../../../../utils/api"
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
          this.buy()
        }else{
          this.showModal()
        }
      })
    }else{
      this.buy()
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
            self.buy()
          }
        })
      }
    })
  },
  // 代金券详情
  voucherDetail() {
    api.getVoucherDetail({
      voucherId: this.data.id
    }).then(res => {
      // console.log(res)
      const data = res.data
      this.setData({
        sellingPrice: data.sellingPrice,
        useType: data.useType,
        voucherName: data.voucherName,
        sum: data.sum,
        condition: data.condition,
        details: data.details,
        voucherPrice: data.voucherPrice
      })
    })
  },
  // 删除
  delete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          api.deleteVoucher({
            userVoucherIds: [this.data.id]
          }).then(res => {
            console.log(res)
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
          voucherId: this.data.id
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
                wx.navigateTo({
                  url: `/pages/self/yhq/yhq`,
                })
              },
              fail(res) {}
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
      state: options.state
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