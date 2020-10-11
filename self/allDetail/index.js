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
        voucherId: null,
        hasAddress: false
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
    // 选择收货地址
  // 前往列表页
  toList() {
    wx.navigateTo({
      url: '/self/address/index?from=list',
    })
  },

  // 新增收货地址
  newAdd() {
    wx.navigateTo({
      url: '/self/address/add/index?from=add',
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
      let noChange = true
      wx.navigateTo({
        url: `/self/comment/index?id=${id}&noChange=${noChange}`,//不能修改评价内容
      })
    },
    // 订单详情
    orderDetail() {
      wx.showLoading({
        title: '加载中',
      })
        api.orderDetail({
            orderId: this.data.id
        }).then(res => {
            const data = res.data
            let buyAddress = []
            let addressId = ''
            let hasAddress = false
            if (data.address) {
              if(!this.data.hasAddress) {
                buyAddress = data.address
                addressId = data.address.addressId
                hasAddress = true
              } else{
                if (this.data.address.addressId !== data.address.addressId) {
                  this.updateAddress()
                }
                buyAddress = this.data.address
                addressId = this.address.addressId
              }
            }
            let endTime = new Date(data.order.endTime).getTime()
            this.setData({
                metricalInformation: data.order.metricalInformation, // 商品规格信息
                // addressId: data.address.addressId,
                expressName: data.order.modeOfDistribution, // 快递方式
                expressNo: data.order.trackingNumber, // 物流单号
                expressFee: data.order.expressFee, // 快递费
                orderType: data.order.orderType,
                merchantId: data.order.merchantId,
                endTime: endTime,
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
                orderAddress: data.order.receiverAddress,
                address: buyAddress,
                addressId: addressId,
                hasAddress: hasAddress
            })
            wx.hideLoading()
            let systimestamp = new Date().getTime();
            var _this = this
            this.setData({
              servicetimeInterval: setInterval(function () { // 循环执行
                systimestamp = (systimestamp / 1000 + 1) * 1000;
                _this.setData({
                  startTime: systimestamp
                })
              }, 1000)
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
    // 更新地址
    updateAddress () {
      api.updateAddress({
        orderId: this.data.id,
        addressId: this.data.address.addressId
      }).then(res => {
        wx.hideLoading()
        if (res.data == 1) {
          console.log("更新地址成功")
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
    // 获取用户手机号
    getUserPhone() {
      api.getUserPhone({
        encryptDataB64: this.data.encryptedData,
        ivB64: this.data.iv,
        sessionKeyB64: wx.getStorageSync('session_key')
      }).then(res => {
        // console.log(res)
        const data = res.data
        if (res.status == 200) {
          // wx.setStorageSync('phone', JSON.parse(data).phoneNumber)
          this.setData({
            phoneNumber: JSON.parse(data).phoneNumber
          })
          this.updatePhone()
        }
        // this.register()
      })
    },
    // 更新手机号
    updatePhone () {
      api.updateUserDetail({
        userPhone: this.data.phoneNumber,
        userId: wx.getStorageSync('userId')
      }).then(res => {
        wx.hideLoading()
        // console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '手机号绑定成功',
            icon: 'none'
          })
        }
      })
    },
    // 获取手机
    getPhoneNumber(e) {
      wx.showLoading({
        title: '',
      })
      const res = e.detail
      if (res.errMsg == "getPhoneNumber:ok") {
        this.setData({
          iv: res.iv,
          encryptedData: res.encryptedData
        })
        this.getUserPhone()
      }
      this.closeModal1()
    },
    // 验证手机号
    checkPhone() {
      wx.showLoading({
        title: '',
      })
      api.checkPhone({
        userId: wx.getStorageSync('userId')
      }).then(res => {
        wx.hideLoading()
        if (res.data == 1) {
          this.sureBuy()
        } else {
          this.setData({
            show: true
          })
        }
      })
    },
    // 关闭弹框
    closeModal1() {
      this.setData({
        show: false,
        modal: false
      })
    },
    // 付款页面
    pay() {
        let self=this
        const addressId = app.globalData.globalData || this.data.addressId
        if(!addressId){
            wx.showToast({
              title: '请添加收货地址',
              icon :"none"
            })
            return
        }
        this.checkPhone()
        // wx.navigateTo({
        //     url: `/self/pay/index?id=${id}&total=${total}&voucherId=${voucherId}&addressId=${addressId}`,
        // })
    },
    // 验证成功后付款
    sureBuy() {
      const id = this.data.id
      const total = this.data.total
      const voucherId = this.data.voucherId || ''
      const addressId = this.data.addressId
      api.settleCommodityOrder({
        orderId: id,
        addressId: addressId,
        userVoucherId: voucherId,
        userId: wx.getStorageSync('userId')
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
              wx.showToast({
                title: '付款成功',
                icon: 'success',
              })
              self.orderDetail()
            },
            fail(res) { }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
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
                    endTime: endTime
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
          merchantId: wx.getStorageSync('merchantId'),
          userId: wx.getStorageSync('userId'),
          condition: this.data.orderPrice,
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
            mask: false,
            show: false
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
        wx.setStorageSync('orderId', options.id)
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