// pages/self/sc/sc.js
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
        scTabIndex: 0,
        list: [],
        isRequest: false,
        pageNum: 1
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl
        })
    },

    // 商品详情
    handleTap(e){
        const id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/goodsDe/index?id=${id}`,
        })
    },

    // 商家详情
    handleTap1(e){
        const id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/store/store?id=${id}`,
        })
    },

    // 取消收藏的商品
    delcollectionGood(e) {
        let list = this.data.list
        let index = app.getValue(e).index
        let commodityId = app.getValue(e).id
        api.collect({
            collectType: 0,
            commodityId
        }).then(res => {
            // console.log(res)
            if (res.data == 1) {
                list.splice(index, 1)
                this.setData({
                    list: list
                })
            }
        })
    },
    // 取消收藏的商家
    delcollectionStore(e) {
        let index = app.getValue(e).index
        let list = this.data.list
        let merchantId = app.getValue(e).id
        api.collect({
            collectType: 1,
            merchantId
        }).then(res => {
            console.log(res)
            if (res.data == 1) {
                list.splice(index, 1)
                this.setData({
                    list: list
                })
            }
        })
    },
    // 商品收藏
    goodSCollections() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.collectCommodityList({
            userId: wx.getStorageSync('userId'),
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log('商品', res)
            wx.hideLoading({})
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                list: [...arr, ...data.list],
                isRequest: false
            })
        })
    },
    // 商家收藏
    merchantCollectiosn() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.collectMerchantList({
            userId: wx.getStorageSync('userId'),
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log('商家', res)
            wx.hideLoading({})
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                list: [...arr, ...data.list],
                isRequest: false
            })
        })
    },
    // 清除数据
    clear() {
        this.setData({
            list: [],
            pageNum: 1,
            isRequest: false
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
        this.clear()
        const index = this.data.scTabIndex
        if (index) {
            this.merchantCollectiosn()
        } else {
            this.goodSCollections()
        }
    },
    // 切换
    changeScTab(e) {
        const index = app.getValue(e).index
        this.setData({
            scTabIndex: index
        })
        this.clear()
        if (index) {
            this.merchantCollectiosn()
        } else {
            this.goodSCollections()
        }
    },
    onReachBottom() {
        const status = this.data.scTabIndex // 0 1
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
                if (status) {
                    this.merchantCollectiosn()
                } else {
                    this.goodSCollections()
                }

            } else {

            }
        }
    }
})