// pages/clDetail/index.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../utils/http"
let timer
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        discount: null,
        id: '',
        modal: false,
        mask: false,
        express: false,
        couponList: [],
        isRequest: false,
        pageNum: 1,
        voucherId: null
    },
    // 确认收货
    confirm(){
        const self = this
        wx.showModal({
            title: '您确定已经收到该商品？',
            content: '点击确定继续',
            success (res) {
              if (res.confirm) {
                api.delCommodityOrder({
                    orderId : self.data.id,
                    orderStatus : 7
                }).then(res => {
                    console.log(res)
                    if (res.status == 200) {
                        self.orderDetail()
                    }
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

    },
    goStore(e) {
        const id = this.data.merchantId
        wx.navigateTo({
            url: `/home/store/store?id=${id}`,
        })
    },
    comment(){
        const id = this.data.id
        wx.navigateTo({
          url: `/self/comment/index?id=${id}`,
        })
    },
    evaluate(){
      const id = this.data.id
      wx.navigateTo({
        url: `/self/evaluate/evaluate?id=${id}`,
      })
    },
    // 订单详情
    orderDetail() {
        api.orderDetail({
            orderId: this.data.id
        }).then(res => {
            const data = res.data
            let buyAddress = []
            let addressId = ''
            if (data.address) {
              buyAddress = data.address
              addressId = data.address.addressId
            }
            this.setData({
                metricalInformation: data.order.metricalInformation, // 商品规格信息
                // addressId: data.address.addressId,
                expressName: data.order.modeOfDistribution, // 快递方式
                expressNo: data.order.trackingNumber, // 物流单号
                expressFee: data.order.expressFee, // 快递费
                orderType: data.order.orderType,
                merchantId: data.order.merchantId,
                endTime: data.order.endTime,
                orderStatus: data.order.orderStatus,
                storeName: data.order.merchantName,
                list: data.orderCommodityList,
                expressFee: data.order.expressFee,
                total: data.order.totalPrices, // 实际价格 == 总额
                voucherPrice: data.voucherPrice, // 优惠价格
                orderNumber: data.order.orderNumber,
                orderTime: data.order.orderTime,
                orderPrice: data.order.orderPrice, // 订单总额
                updateTime: data.order.updateTime ,// 付款时间
                name: data.order.addressName,
                phone: data.order.addressPhone,
                address: data.order.receiverAddress,
                buyAddress: buyAddress,
                addressId: addressId
            })
            // let status = this.data.orderStatus
            // if (status == 1) {
            //     this.setData({
            //         show : true
            //     })
            // }
            // this.addressDetail()
            // 待付款
            if (data.order.orderStatus == 0) {
                this.setData({
                    total: data.order.orderPrice, // 实际价格
                })
            }
        })
    },
    onClose(){
        this.setData({ show: false });
    },
    // 选中优惠券
    select(e) {
        const id = app.getValue(e).id
        let price = app.getValue(e).price
        // console.log(id)
        this.setData({
            voucherId: id,
            modal: false,
            mask: false,
            voucherPrice: price, //优惠金额
            total: ((this.data.orderPrice*100 - price*100)/100).toFixed(2) // 实际金额 = 订单总额 - 优惠价格
        })
    },
    // 取消
    cancel() {
        const self = this
        api.delCommodityOrder({
            orderId: this.data.id,
            orderStatus: 9
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                wx.showToast({
                    title: '您的订单已取消',
                    icon: 'none',
                })
                self.orderDetail()
            }
        })
    },
    // 删除
    delete() {
        const self = this
        wx.showModal({
            title: '确定要删除吗？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    api.delCommodityOrder({
                        orderId: self.data.id,
                        del: 0
                    }).then(res => {
                        // console.log(res)
                        if (res.status == 200) {
                            wx.navigateBack({
                                complete: (res) => {},
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 付款页面
    pay() {
      const addressId = app.globalData.globalData || this.data.addressId
      if(!addressId){
          wx.showToast({
            title: '请添加收货地址',
            icon :"none"
          })
          return
      }
      const id = this.data.id
      const total = this.data.total
      const voucherId = this.data.voucherId || ''
      api.settleCommodityOrder({
        orderId: id,
        addressId: addressId,
        userVoucherId: voucherId,
        userId:wx.getStorageSync('userId')
      }).then(res => {
        console.log(77777,res)
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
      })
        // wx.navigateTo({
        //     url: `/self/pay/index?id=${id}&total=${total}&voucherId=${voucherId}&addressId=${addressId}`,
        // })
    },
    // 选择收货地址
    selectAddress() {
        // 待付款
        if (this.data.orderStatus == 0) {
            wx.navigateTo({
                url: '/self/address/index?flag=true',
            })
        }
    },
    reduce() {
        const self = this
        timer = setInterval(() => {
            let endTime = this.data.endTime
            let diff = endTime - new Date().getTime()
            if (diff <= 0) {
                clearInterval(timer)
                self.setData({
                    diff: false
                })
                // 刷新页面
                self.orderDetail()
                return
            }
            self.setData({
                nowTime: new Date().getTime()
            })
        }, 1000);
    },
    // 刷新数据
    refresh() {
        this.setData({
            couponList: [],
            pageNum: 1,
            isRequest: false
        })
        this.usableVoucherList()
    },
    // 可用优惠券列表
    usableVoucherList() {
        wx.showLoading({
            title: '加载中...',
        })
        let arr = this.data.couponList
        api.usableVoucherList({
            merchantId: this.data.merchantId,
            userId: wx.getStorageSync('userId'),
            condition: this.data.orderPrice,
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                couponList: [...arr, ...data.list],
                isRequest: false
            })
            wx.hideLoading({})
        })
    },
    // 上拉触底操作
    toBottom(e) {
        // console.log(0)
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
                this.usableVoucherList()
            } else {

            }
        }
    },
    // 使用优惠券
    userVoucher() {
        api.userVoucher({

        }).then(res => {
            console.log(res)
        })
    },
    // 显示弹框
    showModal() {
        if (this.data.orderStatus == 0) {
            this.setData({
                modal: true,
                mask: true
            })
            this.refresh()
        }
    },
    // 关闭弹框
    closeModal() {
        this.setData({
            modal: false,
            mask: false
        })
    },
    // 查看物流
    lookLogistics() {
        this.setData({
            express: true,
            mask: true
        })
    },
    // 关闭物流
    closeExpress() {
        this.setData({
            express: false,
            mask: false
        })
    },
    // 收货地址详情
    addressDetail() {
        api.getAddressDetail({
            addressId: app.globalData.addressId || this.data.addressId
        }).then(res => {
            console.log(res)
            const data = res.data
            this.setData({
                name: data.addressName,
                phone: data.addressPhone,
                address: data.receiverAddress
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            baseURL,
            imgBaseUrl,
            nowTime: new Date().getTime(),
            imgUrl
        })
        this.reduce()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.orderDetail()

    },
    refundBtn() {
        const id = this.data.id
        console.log(id)
        wx.navigateTo({
            url: `../refund/index?id=${id}`,
            success: (result) => {},
            fail: () => {},
            complete: () => {}
        });
    }
})