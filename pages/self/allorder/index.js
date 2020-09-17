// pages/self/clorder/index.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http"

let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabarr: [
            '全部',
            '待付款',
            // '拼团中',
            '待发货',
            '待收货',
            '待评价',
            // '退款/售后'
        ],
        orderTabsIndex: 0,
        list: [],
        isRequest: false,
        pageNum: 1
    },
    // 付款
    // 支付订单
    pay(e) {
        const id = app.getValue(e).id
        console.log(id)
        /* api.settleCommodityOrder({
          orderId: id,
          addressId: this.data.addressId,
          userVoucherId: this.data.voucherId
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
                
              },
              fail(res) {}
            })
          }
        }) */
    },
    // 已发货 确认收货
    confirm(e) {
        const self = this
        const id = app.getValue(e).id

        wx.showModal({
            title: '您确定已经收到该商品？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    api.delCommodityOrder({
                        orderId: id,
                        orderStatus: 7
                    }).then(res => {
                        if (res.status == 200) {
                            wx.showToast({
                                title: "操作成功",
                                icon: 'none'
                            })
                            self.setData({
                                pageNum: 1,
                                list: [],
                                isRequest: false
                            })
                            self.orderList()
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 删除
    delete(e) {
        const id = app.getValue(e).id
        // console.log(id)
        const self = this
        wx.showModal({
            title: '确定要删除订单吗？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    api.delCommodityOrder({
                        orderId: id,
                        del: 0
                    }).then(res => {
                        // console.log(res)
                        if (res.status == 200) {
                            self.setData({
                                pageNum: 1,
                                list: [],
                                isRequest: false
                            })
                            self.orderList()
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    goStore(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/store/store?id=${id}`,
        })
    },
    // 订单列表
    orderList() {
        let orderStatus = this.data.orderStatus
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.orderList({
            userId: wx.getStorageSync('userId'),
            buyType: 1, // 普通订单
            pageNum: this.data.pageNum,
            pageSize: 10,
            orderStatus // 订单状态
        }).then(res => {
            wx.hideLoading({})
            // console.log(res)
            const data = res.data
            let list=[...arr, ...data.list]
            list.forEach(m=>{
                let sum=0
                m.orderCommodityDtoList.forEach(n=>{
                    sum=sum+n.amount*n.realPrice
                })
                m.totalPrice=sum
            })
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                list: [...arr, ...data.list],
                isRequest: false
            })
        })
    },
    // 去评价
    goComment(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/self/comment/index.js?id=${id}`,
        })
    },
    // 退货
    refund(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/self/refund/index?id=${id}`,
        })
    },
    // 取消订单
    cancel(e) {
        const id = app.getValue(e).id
        const self = this

        wx.showModal({
            title: '确定要取消订单吗？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    api.delCommodityOrder({
                        orderId: id,
                        orderStatus: 9
                    }).then(res => {
                        // console.log(res)
                        if (res.status == 200) {
                            wx.showToast({
                                title: '您的订单已取消',
                                icon: 'none',
                            })
                            self.setData({
                                pageNum: 1,
                                list: [],
                                isRequest: false
                            })
                            self.orderList()
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl
        })
        if (options.index) {
            const i = options.index
            this.setData({
                orderTabsIndex: i,
                orderStatus: options.status
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
        this.setData({
            pageNum: 1,
            list: [],
            isRequest: false
        })

        this.orderList()
    },
    onReachBottom() {
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
                this.orderList()
            } else {

            }
        }
    },
    // tab切换
    changeTab(e) {
        const index = app.getValue(e).index
        // console.log(index)
        this.setData({
            orderTabsIndex: index,
            orderStatus: app.statusJudge(index),
            pageNum: 1,
            list: [],
            isRequest: false
        })
        this.orderList()
    },
    // 订单详情
    goDetail(e) {
        const id = app.getValue(e).id

        wx.navigateTo({
            url: `/pages/self/allDetail/index?id=${id}`,
            success: (result) => {},
            fail: () => {},
            complete: () => {}
        });
    }
})