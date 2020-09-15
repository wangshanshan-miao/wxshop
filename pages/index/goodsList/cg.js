import api from "../../../utils/api"
import {
  baseURL,
  imgBaseUrl
} from "../../../utils/http"

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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const goodType = Number.parseInt(options.type)
    this.setData({
      baseURL,
      imgBaseUrl,
      nowTime: new Date().getTime(),
      goodType
    })
    this.getList()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 一级分类
  getList(item) {
    wx.setNavigationBarTitle({ title: '分类' })
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
    })
    this.getShopList()
  },
  getShopList(classId) {
    if (this.data.goodType == 0) {// 秒杀
      wx.setNavigationBarTitle({ title: '限时秒杀' })
      api.seckillList({
        merchantId: wx.getStorageSync('merchantId')
      }).then(res => {
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else if (this.data.goodType == 1) {// 拼团
      wx.setNavigationBarTitle({ title: '多人拼团' })
      api.groupBookingList({
        merchantId: wx.getStorageSync('merchantId')
      }).then(res => {
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else if (this.data.goodType == 2 || this.data.goodType == 3) {
      let type
      if (this.data.goodType == 2) {// 新品上市
        type = 0
        wx.setNavigationBarTitle({ title: '新品上市' })
      } else {
        type = 1
        wx.setNavigationBarTitle({ title: '口碑爆款' })
      }
      api.newList({
        merchantId: wx.getStorageSync('merchantId'),
        type: type
      }).then(res => {
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else if (this.data.goodType == 4) {// 清仓
      wx.setNavigationBarTitle({ title: '样品清仓' })
      api.clearanceSaleList({
        merchantId: wx.getStorageSync('merchantId')
      }).then(res => {
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else {
      api.searchResult({
        userId: wx.getStorageSync('userId'),
        merchantId: wx.getStorageSync('merchantId'),
        classId: classId,
        pageNum: this.data.pageNum,
        pageSize: 24
      }).then(res => {
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    }
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
      url: '../search/index/index',
    });
  },
})