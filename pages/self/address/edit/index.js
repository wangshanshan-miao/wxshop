// pages/self/address/update/index.js
import api from "../../../../utils/api"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    def: 0
  },
  // 收获地址详情
  getAddressDetail() {
    api.getAddressDetail({
      addressId: this.data.id
    }).then(res => {
      const data = res.data;
      this.setData({
        addressName: data.addressName,
        addressPhone: data.addressPhone,
        areaCode: data.areaCode,
        codeName: data.codeName,
        receiverAddress: data.receiverAddress,
        def: data.def
      })
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
      codeName: e.detail.value.join("")
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
      addressId: this.data.id,
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
      }
    })
  },
  // 删除收获地址
  delete() {
    api.changeAddress({
      addressId: this.data.id,
      userId: wx.getStorageSync('userId'),
      del: 0
    }).then(res => {
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
    const id = options.id
    // console.log(id)
    if (id) {
      this.setData({
        id
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
    this.getAddressDetail()
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