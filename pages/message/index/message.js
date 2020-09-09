// pages/message/message.js
import api from "../../../utils/api"
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        pageNum: 1,
        totalPage: 1,
        isRequest: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            list: [],
            pageNum: 1
        })
        const userId = wx.getStorageSync('userId')
        if (userId) {
            this.message()
        }
    },
    // 消息列表
    message() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.messageList({
            userId: wx.getStorageSync('userId'),
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                list: [...arr, ...data.list],
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
                this.message()
            } else {

            }
        }
    },
    goMessage(e) {
        const id = app.getValue(e).id
        // console.log(id)
        wx.navigateTo({
            url: `../detail/index?id=${id}`
        });
    }
})