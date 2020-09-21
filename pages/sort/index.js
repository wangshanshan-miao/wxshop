import api from "../../utils/api"
import {
  baseURL,
  imgBaseUrl
} from "../../utils/http"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleName: [],
    activeIndex: 0,
    itemIndex: '',
    selectItem: [],
    pageNum: 1,
    list: [],
    goodSizeShow: false,
    count_down: '',
    goodNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const goodType = Number.parseInt(options.type)
    console.log(options)
    this.setData({
      baseURL,
      imgBaseUrl,
      nowTime: new Date().getTime(),
      goodType
    })
    this.getList()
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
  onReachBottom() {
    const pageNum = this.data.pageNum
    const totalPage = this.data.totalPage
    // 当前页数小于总页数
    if (pageNum < totalPage) {
      this.setData({
        pageNum: pageNum + 1
      })
      this.getShopList(this.data.nav_list[this.data.activeIndex].classId)
    }
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
  // 加入购物车
  addToCart() {
    this.checkUser()
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
      userId: '81'
      // userId: wx.getStorageSync("userId")
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 一级分类
  getList(item) {
    api.getAllClass({
      agencyId: wx.getStorageSync('agencyId')
    }).then(res => {
      res.data.unshift({
        className: "全部"
      })
      this.setData({
        nav_list: res.data,
        // classId: res.data[0].classId
      })
      this.getShopList()
    })
  },
  getShopList(classId) {
    api.searchResult({
      userId: wx.getStorageSync('userId'),
      merchantId: wx.getStorageSync('merchantId'),
      classId: classId,
      pageNum: this.data.pageNum,
      pageSize: 24
    }).then(res => {
      // console.log(res)
      this.setData({
        list: res.data.list,
        totalPage: res.data.totalPage
      })
    })
  },
  switchTap(e) { //更换资讯大类
    console.log(e)
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    let screenWidth = wx.getSystemInfoSync().windowWidth;

    let itemWidth = screenWidth / 5;

    let {
      index,
      type
    } = e.currentTarget.dataset;

    const {
      nav_list
    } = this.data;

    let scrollX = itemWidth * index - itemWidth * 2;

    let maxScrollX = (nav_list.length + 1) * itemWidth;

    if (scrollX < 0) {
      scrollX = 0;
    } else if (scrollX >= maxScrollX) {
      scrollX = maxScrollX;
    }

    this.setData({
      x: scrollX
    })

    this.triggerEvent("switchTap", type); //点击了导航,通知父组件重新渲染列表数据
    this.getShopList(this.data.nav_list[e.currentTarget.dataset.index].classId)
  },
  toSearch() {
    wx.navigateTo({
      url: '/home/search/index/index',
    });
  },
})