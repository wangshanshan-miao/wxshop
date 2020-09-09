// pages/clDetail/index.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http"
let timer
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderState: '',
        orderId: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // 订单详情
    orderDetail() {
        api.orderDetail({
            orderId: this.data.orderId
        }).then(res => {
            console.log(res)
            const data = res.data
            this.setData({
                endTime : data.order.endTime,
                metricalInformation : data.order.metricalInformation,
                userVoucher : data.order.userVoucherId,
                orderStatus: data.order.orderStatus,
                name: data.order.addressName,
                phone: data.order.addressPhone,
                address: data.order.receiverAddress,
                storeName: data.orderDto.merchantName,
                list: data.orderDto.orderCommodityDtoList,
                total: data.order.totalPrices, // 实际价格
                expressFee: data.order.expressFee,
                voucherPrice: data.voucherPrice, // 优惠价格
                orderNumber: data.order.orderNumber,
                orderTime: data.order.orderTime,
                orderPrice: data.order.orderPrice, // 订单总额
                updateTime: data.order.updateTime // 上一个操作的时间
            })
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
                // wx.navigateBack()
                return 
            }
            self.setData({
                nowTime : new Date().getTime()
            })
        }, 1000);
    },
    onLoad: function (options) {
        this.setData({
            orderId: options.id,
            baseURL,
            imgBaseUrl,
            nowTime : new Date().getTime()
        })
        this.reduce()
    },
    // 评价
    comment(){
        const id = this.data.orderId
        wx.navigateTo({
          url: `/pages/self/comment/index.js?id=${id}`,
        })
    },
    // 立即付款
    pay(){
        api.createCommodityOrder({
            orderType : 4,
            orderId : this.data.orderId
        }).then(res=>{
            // console.log(res)
            const data = res.data
            const id = data.orderId
            wx.navigateTo({
              url: `/pages/self/ptDetail/index?id=${id}`,
            })
        })
        /* api.settleCommodityOrder({
            orderId : this.data.orderId,
            userVoucherId : this.data.userVoucherId
        }).then(res=>{
            console.log(res)
        }) */
    },
    // 取消测量
    cancel() {
        api.delCommodityOrder({
            orderId: this.data.orderId,
            orderStatus: 9
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                this.orderDetail()
            }
        })
    },
    // 删除订单
    delete(){
        api.delCommodityOrder({
            orderId : this.data.orderId,
            del : 0
        }).then(res=>{
            console.log(res)
            if (res.status == 200) {
                wx.navigateBack({
                  complete: (res) => {},
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.orderDetail()
    }
})