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
        userList: [],
        oneBookingSum: 0,
        bookingSum: 0,
        address: [],
        hasAddress: false
    },
    // 确认收货
    confirm() {
        const self = this
        wx.showModal({
            title: '您确定已经收到该商品？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    api.delCommodityOrder({
                        orderId: self.data.id,
                        orderStatus: 7
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
            url: `/store/store?id=${id}`,
        })
    },
    comment() {
        const id = this.data.id
        wx.navigateTo({
            url: `/self/comment/index.js?id=${id}`,
        })
    },
  morePt(){
    wx.navigateTo({
      url: '/pages/index/goodsList/cg?type=1'
    })
  },
  // 分享弹框
  sharegood() {
    this.setData({
      modal1: true,
      share: true
    })
  },
  // 生成海报弹框
  makePoster() {
    console.log("生成海报")
    wx.setStorageSync('bgImg', imgBaseUrl + this.data.list[0].coverUrl);
    wx.setStorageSync('goodName', this.data.list[0].commodityName);
    wx.setStorageSync('price', this.data.list[0].realPrice);
    wx.setStorageSync('unit', this.data.list[0].unit ? this.data.list[0].unit : '');
    api.getinviteCode({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      wx.setStorageSync('userInvite', imgBaseUrl + res.data);
      this.setData({
        poster: !this.data.poster,
        modal: false,
        share: false
      })
    })
  },
  // canvas 生成图片路径
  makeTempFilePath() {
    const self = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 572,
      height: 888,
      destWidth: 572,
      destHeight: 888,
      canvasId: 'myCanvas',
      canvas: this.data.canvas,
      success(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none'
            })
            self.setData({
              modal: false,
              poster: false
            })
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  closeShare() {
    this.setData({
      modal1: false,
      share: false
    })
  },
  // 预览图片
  preview() {
    const self = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 572,
      height: 888,
      destWidth: 572,
      destHeight: 888,
      canvasId: 'myCanvas',
      canvas: this.data.canvas,
      success(res) {
        // console.log(res.tempFilePath)
        wx.previewImage({
          urls: res.tempFilePath,
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  // canvas 保存图片
  savePoster() {
    this.makeTempFilePath()
  },
  // canvas 画图
  draw() {
    const self = this
    // const url = baseURL + this.data.detail.coverUrl
    const url = imgBaseUrl + this.data.detail.coverUrl
    const text = this.data.detail.commodityName
    wx.createSelectorQuery().select('#myCanvas')
      .fields({
        node: true, // canvas 实例
        size: true // 节点宽高
      })
      .exec((res) => {
        let canvas = res[0].node
        let ctx = canvas.getContext('2d')
        let width = res[0].node.width
        let height = res[0].node.height
        self.setData({
          canvas,
          ctx
        })
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        ctx.save()


        // 绘制白色背景
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 286, 444)

        ctx.restore()


        // 绘制图片
        const img = canvas.createImage()
        img.onload = () => {
          ctx.drawImage(img, 0, 16, width, 203)
        }
        img.src = url

        const img1 = canvas.createImage()
        img1.onload = () => {
          ctx.drawImage(img1, 8, 231, 33, 11)
        }
        img1.src = 'https://www.deejv.com/unite/upload/2020330/1585556759866198243366.png'

        const img2 = canvas.createImage()
        img2.onload = () => {
          ctx.drawImage(img2, 192, 305, 80, 75)
        }
        // 小程序二维码
        img2.src = 'http://118.89.53.192:3002/public/uploads/upload_580400e3dbb9531fb6df53c5481689bb.jpg'



        // 绘制文本
        ctx.font = "9px";
        ctx.fillText(text, 55, 241);

        ctx.font = "10px";
        ctx.fillText("长按识别小程序", 23, 311);
      })
  },
  closePoster() {
    this.setData({
      poster: false,
      modal: false
    })
  },
    // 订单详情
    orderDetail() {
      wx.showLoading({
        title: '加载中...',
      })
        api.orderDetail({
            orderId: this.data.id
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            for (let i = 0; i < data.oneBookingSum; i++) {
                if (!data.userList[i]) {
                    data.userList.push({
                        headUrl: ''
                    })
                }
            }
            let buyAddress = []
            let addressId = ''
            let hasAddress = false
            if (data.address) {
              if (!this.data.hasAddress) {
                buyAddress = data.address
                addressId = data.address.addressId
                hasAddress = true
              } else {
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
                endTime1: data.order.endTime,
                endTime: endTime,
                createTime:data.order.createTime,
                orderStatus: data.order.orderStatus,
                storeName: data.order.merchantName,
                list: data.orderCommodityList,
                expressFee: data.order.expressFee,
                total: data.order.totalPrices, // 实际价格 == 总额
                voucherPrice: data.voucherPrice, // 优惠价格
                orderNumber: data.order.orderNumber,
                orderTime: data.order.orderTime,
                orderPrice: data.order.orderPrice, // 订单总额
                updateTime: data.order.updateTime, // 上一次操作的时间
                name: data.order.addressName,
                phone: data.order.addressPhone,
                orderAddress: data.order.receiverAddress,
                userList: data.userList,
                oneBookingSum: data.oneBookingSum,
                bookingSum: data.bookingSum,
                address: buyAddress,
                hasAddress: hasAddress
            })
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
    updateAddress() {
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
    onClose() {
        this.setData({
            show: false
        });
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
            total: ((this.data.orderPrice * 100 - price * 100) / 100).toFixed(2) // 实际金额 = 订单总额 - 优惠价格
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
      let self = this
      const addressId = this.data.addressId || this.data.address.addressId
        if (!addressId) {
            wx.showToast({
                title: '请添加收货地址',
                icon: "none"
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