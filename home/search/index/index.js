/**
 * index.js
 */
import api from "../../../utils/api.js"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    goodSizeShow: false,
    count_down: '',
    goodNum: 1
  },
  // 输入内容
  input(e) {
    // console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  // 清除搜索内容
  clearAll() {
    this.setData({
      value: "",
      arr: []
    })
  },
  // 点击搜索历史标签
  handleTap(e) {
    const content = e.currentTarget.dataset.content
    api.searchResult({
      merchantId: wx.getStorageSync('merchantId'),
      userId: wx.getStorageSync('userId'),
      history: content
    }).then(res => {
      // console.log(res)
      this.setData({
        arr: res.data.list,
        value: content
      })
    })
  },
  // 搜索结果
  searchResult() {
    const value = this.data.value.trim()
    if (value != "") {
      api.searchResult({
        userId: wx.getStorageSync('userId'),
        history: value,
        merchantId: wx.getStorageSync('merchantId')
      }).then(res => {
        // console.log(res)
        if (res.status == 200) {
          this.setData({
            arr: res.data.list
          })
          if (res.data.list.length == 0) {
            wx.showToast({
              title: '没有搜索到任何内容~',
              icon: "none"
            })
          }
          this.history()
        }
      })
    } else {
      wx.showToast({
        title: '请输入搜素内容',
        icon: "none"
      })
    }
  },

  // 搜索历史
  history() {
    api.searchHistory({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log(res)
      this.setData({
        historyArr: res.data
      })
    })
  },
  // 清除搜索历史
  clearHistory() {
    const self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除所有搜索记录吗？',
      success(res) {
        if (res.confirm) {
          api.clearHistory({
            userId: wx.getStorageSync('userId')
          }).then(res => {
            // console.log(res)
            if (res.status == 200) {
              self.setData({
                historyArr: []
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  // 商品详情
  goodDetail(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type //0：限时秒杀；1：拼团；2：清仓
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/home/goodsDe/index?id=${id}&type=${type}`,
    })
  },
  addCar(e) {
    app.checkUser()
    this.setData({
      id: e.currentTarget.dataset.data.outId,
      detail: e.currentTarget.dataset.data
    })
    this.specification()
    this.setData({
      goodSizeShow: true
    })
  },
  close_goodSizeShow() {
    this.setData({
      goodSizeShow: false
    })
  },
  reduceNum() {
    if (this.data.goodNum <= 1) {
      wx.showToast({
        title: '商品数量不可以小于1件',
        icon: 'none',
        duration: 1500,
      });
      return false
    }
    this.setData({
      goodNum: this.data.goodNum - 1
    })
  },
  addNum() {
    this.setData({
      goodNum: this.data.goodNum + 1
    })
  },
  // 切换规格
  switch(event) {
    const index = event.currentTarget.dataset.index
    const specificationId = event.currentTarget.dataset.commodityspecificationid
    const price = event.currentTarget.dataset.p
    this.setData({
      currentPrice: price,
      skuIndex: index,
      specificationId: specificationId //规格id
    })
  },
  // 商品规格
  specification() {
    api.commoditySpecification({
      outId: this.data.id
    }).then(res => {
      console.log(res)
      const data = res.data
      this.setData({
        good: data,
        /* specificationId: data.commoditySpecificationList[0].commoditySpecificationId */
      })
    })
  },
  // 加入购物车
  addToCart() {
    app.checkUser()
    let specificationId = this.data.specificationId
    if (this.data.good.commoditySpecificationList.length > 0) {
      if (!specificationId) {
        wx.showToast({
          title: '请选择商品规格',
          icon: 'none'
        })
        return false
      }
    }
    api.addToCart({
      commoditySpecificationId: this.data.specificationId,
      amount: this.data.goodNum,
      outId: this.data.id,
      // userId: '81'
      userId: wx.getStorageSync("userId")
    }).then(res => {
      this.setData({
        goodSizeShow: false
      })
      if (res.status == 200) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      /* wx.switchTab({
          url: `/pages/buyCar/index/car`
      }) */
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        baseURL,
        imgBaseUrl,
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
    this.history()
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