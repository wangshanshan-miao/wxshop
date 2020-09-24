// pages/index/pt/pt.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http"
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgArr: [],
        tabIndex: 0
    },
    // 回到顶部
    toTop() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },
    // 获取轮播图
    swiper() {
        api.getSwiper({
            areaCode: wx.getStorageSync('areaCode'),
            site: 3
        }).then(res => {
            // console.log("轮播图", res)
            this.setData({
                imgArr: res.data.carouselList
            })
        })
    },
    // 一级分类
    getList() {
        api.getAllClass({
            areaCode: wx.getStorageSync('areaCode')
        }).then(res => {
            // console.log(res.data[0].classId)
            this.setData({
                list: res.data,
                // classId: res.data[0].classId
            })
        })
    },
    // 二级分类
    category() {
        const arr = this.data.arr
        wx.showLoading({
            title: '加载中...',
        })
        api.clearanceSaleList({
            areaCode: wx.getStorageSync('areaCode'),
            classId: this.data.classId,
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                arr: [...arr, ...data.list],
                isRequest: false
            })
            wx.hideLoading({})
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
                this.category()
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
            imgBaseUrl,
            imgUrl
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
        this.setData({
            arr: [],
            pageNum: 1,
            isRequest: false
        })
        this.swiper()

        api.getAllClass({
            areaCode: wx.getStorageSync('areaCode')
        }).then(res => {
            this.setData({
                list: [{name:'全部',classId:null},...res.data],
                // classId: res.data[0].classId
            })
            this.category()
        })
    },
    // tab切换
    choseType(e) {
        const classId = app.getValue(e).id
        console.log(classId)
        this.setData({
            tabIndex: app.getValue(e).index,
            classId,
            arr: [],
            pageNum: 1,
            isRequest: false
        })
        this.category()
    },
    // 详情
    detail(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/qcDe/index?id=${id}`,
        })
    }

})