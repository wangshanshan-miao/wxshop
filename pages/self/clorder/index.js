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
            '待测量',
            '进行中',
            '已完成'
        ],
        orderTabsIndex: 0,
        list: [],
        isRequest: false,
        pageNum: 1
    },
    // 取消测量
    cancel(e){
        const id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/self/clDetail/index?id=${id}`,
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
            buyType: 2, // 测量订单
            pageNum: this.data.pageNum,
            pageSize: 10,
            orderStatus // 订单状态
        }).then(res => {
            console.log(res)
            const data = res.data
            wx.hideLoading({})
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                list: [...arr, ...data.list],
                isRequest: false
            })
        })
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl
        })
        if (options.index) {
            this.setData({
                orderTabsIndex : options.index,
                orderStatus : options.status
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
    // tab切换
    changeTab(e) {
        const i = app.getValue(e).index
        this.setData({
            orderTabsIndex: i,
            orderStatus : app.statusJudge1(i),
            pageNum: 1,
            list: [],
            isRequest: false
        })
        this.orderList()
    },
    // 测量订单详情
    goDetail(e) {
        let id = app.getValue(e).id
        wx.navigateTo({
            url: '../clDetail/index?id=' + id,
            success: (result) => {},
            fail: () => {},
            complete: () => {}
        });

    }
})