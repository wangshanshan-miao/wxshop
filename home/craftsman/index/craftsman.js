// pages/index/product/product.js
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
        key: 1,
        typeIndex: -1,
        chiTypeIndex: 1,
        totalPage: 1,
        pageNum: 1,
        list: [],
        isRequest: false
    },
    call(e) {
        /* let tel = app.getValue(e).tel
        console.log(tel) */
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    },
    // 获取区域代理电话
    getPhone(){
        api.getPhone({
            areaCode : wx.getStorageSync('shortAreaCode')
        }).then(res=>{
            // console.log(res)
            if (res.status == 200) {
                this.setData({
                    phone : res.data
                })
            }
        })
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
            list: [],
            pageNum: 1
        })
        this.swiper()

        api.getDictValue({
            dataType: 'field_expertise'
        }).then(res => {
            console.log(res)
            this.setData({
                categories: res.data,
                // fieldExpertiseId: res.data[0].key,
                subordinateLevelId: 1,
            })
        })
        this.list()
        this.getPhone()
    },
    // 轮播图
    swiper() {
        api.getSwiper({
            areaCode: wx.getStorageSync('areaCode'),
            site: 4
        }).then(res => {
            // console.log(res)
            this.setData({
                swiperList: res.data.carouselList
            })
        })
    },
    // 分类
    /* category() {
        api.getDictValue({
            dataType: 'field_expertise'
        }).then(res => {
            console.log(res)
            this.setData({
                categories: res.data
            })
        })
    }, */
    // 工匠列表
    list() {
        const arr = this.data.list
        const pageNum = this.data.pageNum
        wx.showLoading({
            title: '加载中...',
        })
        api.getCraftsmanList({
            areaCode: wx.getStorageSync('areaCode'),
            fieldExpertiseId: this.data.fieldExpertiseId,
            subordinateLevelId: this.data.chiTypeIndex,
            pageNum,
            pageSize: 10
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
        if (pageNum < totalPage) {
            if (!isRequest) {
                this.setData({
                    pageNum: pageNum + 1,
                    isRequest: true
                })
                this.list()
            } else {

            }
        }
    },
    choseType(e) {
        this.setData({
            typeIndex: app.getValue(e).index,
            list: [],
            pageNum: 1,
            fieldExpertiseId: app.getValue(e).key,
        })
        this.list()
    },
    cahngeChiType(e) {
        this.setData({
            chiTypeIndex: app.getValue(e).index,
            list: [],
            pageNum: 1
        })
        this.list()
    }
})