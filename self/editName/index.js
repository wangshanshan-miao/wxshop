import api from "../../utils/api"

// pages/self/editName/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },
  // 输入
  inputValue(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // 清除
  clear() {
    this.setData({
      value: ''
    })
  },
  // 更新
  update() {
    api.updateUserDetail({
      userId: wx.getStorageSync('userId'),
      userName: this.data.value
    }).then(res => {
      // console.log(res)
      if (res.status == 200) {
        wx.showToast({
          title: '操作成功',
          icon : 'none'
        })
        setTimeout(()=>{
            wx.navigateBack({
                delta: 1
            });
        },1000)
       
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({
    value:options.name
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