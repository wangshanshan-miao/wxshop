// pages/self/yhq/yhq.js
import api from "../../utils/api"
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    yhqTabIndex: 0, // 优惠券类型 
    tabArr: [
      '全部',
      '待使用',
      '已使用'
    ],
    ids: [],
    list: [],
    isRequest: false,
    pageNum: 1,
    mananger: true,
    isSelectAll: false,
    useType: 1 // 0:优惠券，1：代金券
  },
  // 优惠券列表 0 - 待使用 1 - 已过期 2 - 退款
  voucherList() {
    const arr = this.data.list
    wx.showLoading({
      title: '加载中...',
    })
    let params
    if (this.data.yhqTabIndex == 0) {
      params = {
        userId: wx.getStorageSync('userId'),
        pageNum: this.data.pageNum,
        pageSize: 10,
        useType: this.data.useType
      }
    } else {
      params = {
        userId: wx.getStorageSync('userId'),
        voucherStatus: this.data.yhqTabIndex,
        pageNum: this.data.pageNum,
        pageSize: 10,
        useType: this.data.useType
      }
    }
    api.voucherList(params).then(res => {
      wx.hideLoading({})
      const data = res.data
      let newArr = data.list.map(item => {
        item.select = false
        return item
      })
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        list: [...arr, ...newArr],
        isRequest: false
      })
    })
  },
  // 评价
  sendTalk () {
    
  },
  // 检测是否全选
  checkSelectAll() {
    let arr = this.data.list;
    // 默认全选
    let flag = true;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].select) {
        flag = false
      }
    }
    this.setData({
      isSelectAll: flag
    })
  },
  /* // 退款状态
  state() {
      const state = this.data.mananger;
      if (!state) {
          return false
      }
      wx.navigateTo({
          url: '/pages/self/yhq/state/index',
      })
  }, */
  // 管理
  manange() {
    this.setData({
      mananger: false
    })
  },
  // 完成
  complete() {
    this.setData({
      mananger: true
    })
  },
  // 全选或全不选
  selectAll() {
    let arr = []
    let newArr = this.data.list
    this.setData({
      isSelectAll: !this.data.isSelectAll
    })
    const status = this.data.isSelectAll
    // 全选
    if (status) {
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].select = true
        arr.push(newArr[i].userVoucherId)
      }
      // 全不选
    } else {
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].select = false
      }
    }
    this.setData({
      list: newArr,
      ids: arr
    })
  },
  // 选择或者取消
  select(e) {
    const id = app.getValue(e).detailid
    let arr = this.data.list;
    let newArr = this.data.ids
    for (let i = 0; i < arr.length; i++) {
      if (id == arr[i].userVoucherId) {
        arr[i].select = !arr[i].select
        // 选中
        if (arr[i].select) {
          newArr.push(arr[i].userVoucherId)
          // 取消
        } else {
          newArr = newArr.filter(item => {
            return id != item
          })
        }
        this.checkSelectAll()
        break
      }
    }
    this.setData({
      list: arr,
      ids: newArr
    })
  },
  // 删除
  delete() {
    const self = this
    let list = this.data.list
    let ids = this.data.ids
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          api.deleteVoucher({
            userVoucherIds: ids
          }).then(res => {
            console.log(res)
            // 删除操作
            if (res.status == 200) {
              for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < list.length; j++) {
                  const element = list[j];
                  if (element.userVoucherId == ids[i]) {
                    list.splice(j, 1)
                  }
                }
              }
              self.setData({
                list
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  onReachBottom() {
    console.log('etstsgh')
    const isRequest = this.data.isRequest
    const pageNum = this.data.pageNum
    const totalPage = this.data.totalPage
    // 当前页数小于总页数
    if (pageNum < totalPage) {
      if (!isRequest) {
        this.setData({
          pageNum: pageNum + 1,
          isRequest: true
        })
        this.voucherList()
      } else {

      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      list: [],
      pageNum: 1,
      yhqTabIndex: 0
    })
    this.voucherList()
  },
  // tab切换
  changeTab(e) {
    this.setData({
      yhqTabIndex: app.getValue(e).index,
      isRequest: false,
      list: [],
      pageNum: 1,
      ids: [],
      isSelectAll: false
    })
    this.voucherList(app.getValue(e).index)
  },
  // 使用说明
  explain() {
    wx.navigateTo({
      url: '/self/yhq/explain/index',
    })
  },
  // 优惠券详情
  detail(e) {
    const id = app.getValue(e).detailid
    // console.log(id)
    const state = this.data.mananger;
    if (!state) {
      return false
    }
    wx.navigateTo({
      url: `/self/yhq/detail2/index?id=${id}`,
    })
  },
  // 去用券
  goDjq(e) {
    let id = app.getValue(e).id
    wx.navigateTo({
      url: `/home/voucher/voucher?id=${id}`,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  }
})