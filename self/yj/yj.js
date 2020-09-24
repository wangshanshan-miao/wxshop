// pages/self/yj/yj.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../utils/http"
let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        listModelTabIndex: 0,
        txShow: false,
        list: [],
        isRequest: false,
        pageNum: 1,
        mask: false,
        show: false,
        money: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
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
        this.commission()
        this.setData({
            list: [],
            pageNum: 1,
            isRequest: false,
            totalPage : 1,
            mask: false,
            show: false
        })
        this.income(0)
    },
    // 我的佣金
    commission() {
        this.setData({
            incomeList: []
        })
        api.commission({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            const data = res.data
            this.setData({
                userId: data.userId,
                sumMoney: data.sumMoney,
                remainingSumMoney: data.remainingSumMoney,
                withdrawMoney: data.withdrawMoney,
                depositMoney: data.depositMoney
            })
        })
    },
    // 收入
    income(val) {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.commissionList({
            userId: wx.getStorageSync('userId'),
            commissionType: val,
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
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
    closeModal() {
        this.setData({
            mask: false,
            show: false
        })
    },
    inputMoney(e) {
        const value = e.detail.value.trim()
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        const result = reg.test(value)
        if (result) {
            // 提现金额应小于余额
            if (value < this.data.remainingSumMoney) {
                this.setData({
                    money: e.detail.value.trim()
                })
            }
        } else {
            this.setData({
                money: ''
            })
        }
    },
    // 全部提现
    takeAll() {
        this.setData({
            money: this.data.remainingSumMoney
        })
    },
    // 提现弹框
    withDraw() {
        this.setData({
            mask: true,
            show: true
        })
    },
    confirm() {
        const money = this.data.money
        if (!money) {
            wx.showToast({
                title: '请输入提现金额',
                icon: 'none'
            })
            return false
        }
        this.closeModal()
        api.deposit({
            depositPrice: money
        }).then(res => {
            console.log(res)
            if (res.status == 200) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                });
                this.setData({
                    money: ''
                })
                this.commission()
            }
        })
    },
    // 分销奖励明细
    fx(e) {
        const id = app.getValue(e).id
        // console.log(id)
        wx.navigateTo({
            url: `/pages/self/fx/fx?id=${id}`,
        })
    },
    // 提现
    tx(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/self/txjg/index?id=${id}`
        })
    },
    onReachBottom() {
        const type = this.data.listModelTabIndex
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
                this.income(type)
            } else {

            }
        }
    },
    // 切换
    changeListModelTab(e) {
        this.setData({
            listModelTabIndex: app.getValue(e).index,
            list: []
        });
        // 0 是收入  1是支出
        this.income(app.getValue(e).index)
    },
    // 提现按钮
    withdrawal() {
        // 余额不足
        if (this.data.remainingSumMoney < this.data.depositMoney) {
            this.setData({
                txShow: !this.data.txShow
            })
            // 提现操作
        } else {
            this.withDraw();
        }
    },
    closeWithdrawal() {
        this.setData({
            txShow: !this.data.txShow
        })
    },
    goTxList() {
        wx.navigateTo({
            url: '../txlist/index',
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });

    },
    goFx() {
        wx.navigateTo({
            url: '../fx/fx',
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });
    }
})