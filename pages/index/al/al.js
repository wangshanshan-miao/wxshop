/*
 * @Descripttion: 前端开发
 * @version: 1.0
 * @Author: ls
 * @Date: 2020-06-16 15:02:58
 * @LastEditors: ls
 * @LastEditTime: 2020-08-10 15:20:44
 */
// pages/index/al/al.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http"
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isRequest: false,
        pageNum: 1,
        id: ''
    },
    // 进店
    goStore(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/store/store?id=${id}`,
        })
    },
    // 案例展示
    caseList() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.getCaseList({
            areaCode: wx.getStorageSync('areaCode'),
            allianceId: this.data.id,
            pageNum: this.data.pageNum,
            pageSize: 10,
            merchantType: this.data.type
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type,
            baseURL,
            imgBaseUrl,
            id: options.id
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
            pageNum: 1,
            isRequest: false
        })
        this.caseList()
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
                this.caseList()
            } else {

            }
        }
    },
    goAlxq(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `../alxq/alxq?id=${id}`,
        });
    }
})