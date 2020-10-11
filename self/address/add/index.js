// pages/self/address/add/index.js
import api from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: null,
    region: [],
    def: 0
  },
  // 选择区域
  selectArea(e) {
    // console.log(e)
    let code = e.detail.code.pop()
    this.setData({
      region: e.detail.value,
      cityCode: code
    })
  },
  inputName(e) {
    this.setData({
      addressName: e.detail.value.trim()
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
  // 详细地址
  inputAddress(e) {
    this.setData({
      receiverAddress: e.detail.value.trim()
    })
  },
  // 选择区域
  selectArea(e) {
    let code = e.detail.code.pop()
    this.setData({
      region: e.detail.value,
      areaCode: code,
      codeName : e.detail.value.join("")
    })
  },
  // 是否设置为默认地址
  change(e) {
    // console.log(e)
    if (e.detail.value) {
      this.setData({
        def: 1
      })
    } else {
      this.setData({
        def: 0
      })
    }
  },
  // 更新收获地址
  update() {
    const codeName = this.data.codeName
    const addressPhone = this.data.addressPhone
    if (!addressPhone) {
      wx.showToast({
        title: '请填写正确的手机格式',
        icon :'none'
      })
      return
    }
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
      def: this.data.def
    }).then(res => {
      if (res.status == 200) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        // wx.navigateBack({
        //   complete: (res) => {},
        // })
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          from: this.data.from,
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugger
    if (options.from) {
      this.setData({
        from: options.from
      })
    } else {
      this.setData({
        form: ''
      })
    }
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