import api from "../../../utils/api"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
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
    let site
    if (goodType == 0) { // 秒杀
      site = 2
      let seckillId = options.seckillId
      this.setData({
        seckillId
      })
    } else if (goodType == 1) { // 拼团
      site = 1
    } else if (goodType == 4) { // 清仓
      site = 3
    } else {
      site = ''
    }
    this.setData({
      baseURL,
      imgBaseUrl,
      nowTime: new Date().getTime(),
      goodType,
      imgUrl,
      site,
      imgArr: []
    })
    this.getList()
    if (site !== '') {
      this.swiper()
    }
  },
  // 首页轮播图
  swiper() {
    api.getSwiper({
      merchantId: wx.getStorageSync('merchantId'),
      site: this.data.site
    }).then(res => {
      if (res.status == 200) {
        let arr = res.data
        this.setData({
          imgArr: arr
        })
      }
      console.log(this.data.imgArr)
    })
  },
  // 获取秒杀信息
  selectSeckill() {
    api.selectSeckill({
      merchantId: wx.getStorageSync('merchantId'),
      seckillId: this.data.seckillId
    }).then(res => {
      wx.hideLoading()
      if (res.data.type == 0) {
        wx.showToast({
          title: '没有秒杀活动',
        })
      } else{
        let systimestamp =  new Date().getTime();
        this.setData({
          // startTime: new Date().getTime(),
          endTime: new Date(res.data.endTime).getTime()
        })
        var _this = this
        this.setData({
          servicetimeInterval: setInterval(function () { // 循环执行
            systimestamp = (systimestamp / 1000 + 1) * 1000;
            _this.setData({
              startTime: systimestamp
            })
          }, 1000)
        })
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 商品详情
  toDetail (e) {
    const type = e.currentTarget.dataset.type //0：限时秒杀；1：拼团；2：清仓
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/home/goodsDe/index?id=${id}&type=${type}`,
    })
  },
  // 一级分类
  getList(item) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.setNavigationBarTitle({ title: '分类' })
    api.getAllClass({
      agencyId: wx.getStorageSync('agencyId')
    }).then(res => {
      wx.hideLoading()
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
    wx.showLoading({
      title: '加载中...',
    })
    if (this.data.goodType == 0) {// 秒杀
      wx.setNavigationBarTitle({ title: '限时秒杀' })
      api.seckillList({
        merchantId: wx.getStorageSync('merchantId'),
        seckillId: this.data.seckillId,
        classId: classId
      }).then(res => {
        this.selectSeckill()
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else if (this.data.goodType == 1) {// 拼团
      wx.setNavigationBarTitle({ title: '多人拼团' })
      api.groupBookingList({
        merchantId: wx.getStorageSync('merchantId'),
        classId: classId
      }).then(res => {
        for(var i = 0;i<res.data.list.length; i++) {
          res.data.list[i].endTime = new Date(res.data.list[i].endTime).getTime()
          res.data.list[i].startTime = new Date().getTime()
        }
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
        var _this = this
        let systimestamp = new Date().getTime();
        this.setData({
          servicetimeInterval: setInterval(function () { // 循环执行
            systimestamp = (systimestamp / 1000 + 1) * 1000;
            _this.setData({
              startTime: systimestamp
            })
          }, 1000)
        })
        wx.hideLoading()
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
        type: type,
        classId: classId
      }).then(res => {
        wx.hideLoading()
        this.setData({
          list: res.data.list,
          totalPage: res.data.totalPage
        })
      })
    } else if (this.data.goodType == 4) {// 清仓
      wx.setNavigationBarTitle({ title: '样品清仓' })
      api.clearanceSaleList({
        merchantId: wx.getStorageSync('merchantId'),
        classId: classId
      }).then(res => {
        wx.hideLoading()
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
        wx.hideLoading()
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
    let classId = e.currentTarget.dataset.id
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
    this.getShopList(classId)
  },
  toSearch() {
    wx.navigateTo({
      url: '../search/index/index',
    });
  },
})