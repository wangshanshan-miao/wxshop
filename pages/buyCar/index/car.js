// pages/buyCar/car.js
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
        count: null,
        isSelectAll: false,
        status: true,
        // list: [],
        isRequest: false,
        pageNum: 1,
        arr: [],
        carids: [], //购物车id数组
        commoditySpecificationIds: [], // 商品规格数组
        amounts: [], // 商品数量数组
        mids: [], // 商家id
        goods: [], //选中的商品id列表
        total: 0 // 总计
    },
    checkUser() {
        app.checkUser()
    },
    // 购物车列表
    myCart() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.myCart({
            "userId": wx.getStorageSync('userId'),
            "pageNum": this.data.pageNum,
            "pageSize": 10
        }).then(res => {
            // console.log(res)
            wx.hideLoading({})
            const data = res.data
            let newArr = [...arr, ...data.list]
            let result = newArr.map(item => {
                item.commodityDtoList.map(item => {
                    item.select = false
                    return item
                })
                return item
            })
            // console.log(result)
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                // list: [...arr, ...data.list],
                isRequest: false,
                arr: result
            })
            this.checkSelectAll()
        })
    },
    // 总计
    totalNum() {
        let newArr = this.data.arr
        let sum = 0
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                if (element[j].select) {
                    sum += element[j].salePrice * element[j].amount
                }
            }
        }
        this.setData({
            total: sum
        })
    },
    // 检测店铺是否有商品
    checkStore() {
        let arr = []
        let newArr = this.data.arr;
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                if (element[j].select) {
                    arr.push(element[j].merchantId)
                    break
                }
            }
        }
        this.setData({
            mids: arr
        })
    },
    // 检查是否全选
    checkSelectAll() {
        let newArr = this.data.arr
        // 默认全选
        let flag = true
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                if (!element[j].select) {
                    flag = false
                    break
                }
            }
        }
        this.setData({
            isSelectAll: flag
        })
    },
    // 全选或全不选
    selectAll() {
        let newArr = this.data.arr
        let goodsArr = []
        let carids = []
        this.setData({
            isSelectAll: !this.data.isSelectAll
        })
        let isSelectAll = this.data.isSelectAll
        // 全选加入
        if (isSelectAll) {
            for (let i = 0; i < newArr.length; i++) {
                let element = newArr[i].commodityDtoList
                for (let j = 0; j < element.length; j++) {
                    element[j].select = true
                    goodsArr.push(element[j].commodityId)
                    carids.push(element[j].shoppingTrolleyId)
                }
            }
            // 全不选
        } else {
            for (let i = 0; i < newArr.length; i++) {
                let element = newArr[i].commodityDtoList
                for (let j = 0; j < element.length; j++) {
                    element[j].select = false
                }
            }
        }
        this.setData({
            arr: newArr,
            goods: goodsArr,
            carids
        })
        this.totalNum()
        this.checkStore()
    },
    // 选择或者取消
    select(e) {
        let arr = this.data.goods
        let arr1 = this.data.carids
        let id = app.getValue(e).id
        let newArr = this.data.arr;
        // console.log(newArr)
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                // 操作当前商品
                if (element[j].commodityId == id) {
                    element[j].select = !element[j].select
                    // 添加
                    if (element[j].select) {
                        arr.push(element[j].commodityId)
                        arr1.push(element[j].shoppingTrolleyId)
                    } else {
                        // 删除
                        arr = arr.filter(item => {
                            return item != id
                        })
                        arr1 = arr1.filter(item => {
                            return item != element[j].shoppingTrolleyId
                        })
                    }
                    this.checkSelectAll()
                }
            }
        }
        this.setData({
            arr: newArr,
            goods: arr,
            carids: arr1
        })
        this.totalNum()
        this.checkStore()
    },
    // 刷新
    refresh() {
        this.setData({
            list: [],
            pageNum: 1,
            arr: [],
            carids: [],
            goods: [],
            amounts: [],
            commoditySpecificationIds: [],
            mids: [],
            isSelectAll: false,
            total: 0,
            status: true
        })
        this.myCart()
    },
    // 删除
    delete() {
        const self = this
        const shoppingTrolleyIds = self.data.carids
        if (shoppingTrolleyIds.length == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none'
            })
            return
        }
        wx.showModal({
            title: '确定要删除该商品吗？',
            content: '点击确定继续',
            success(res) {
                if (res.confirm) {
                    // console.log('用户点击确定')
                    api.delete({
                        shoppingTrolleyIds
                    }).then(res => {
                        // console.log(res)
                        if (res.status == 200) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                        }
                        // 刷新
                        self.refresh()
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 结算
    settlement() {
        let mids = this.data.mids
        if (mids.length > 1) {
            wx.showToast({
                title: '不能跨店结算',
                icon: 'none'
            })
            return
        }
        if (mids.length == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none'
            })
            return
        }
        let goods = this.data.goods // 商品id数组
        let amounts = []
        let commoditySpecificationIds = []
        let newArr = this.data.arr;
        for (let k = 0; k < goods.length; k++) {
            for (let i = 0; i < newArr.length; i++) {
                let element = newArr[i].commodityDtoList
                for (let j = 0; j < element.length; j++) {
                    if (element[j].commodityId == goods[k]) {
                        amounts.push(element[j].amount)
                        // 没有商品规格id 加入-1
                        if (element[j].commoditySpecificationId) {
                            commoditySpecificationIds.push(element[j].commoditySpecificationId)
                        } else {
                            commoditySpecificationIds.push(-1)
                        }
                    }
                }
            }
        }

        // 生成商品订单 
        api.createCommodityOrder({
            orderType: 0,
            merchantId: mids[0],
            commodityIds: goods,
            amounts,
            shoppingTrolleyIds: this.data.carids,
            commoditySpecificationIds
        }).then(res => {
            console.log(res)
            // 创建成功 跳转到订单详情页
            if (res.data.status == 1) {
                const id = res.data.orderId
                // console.log(id)
                wx.navigateTo({
                    url: `/pages/self/ptDetail/index?id=${id}`,
                })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
    },
    // 管理
    mananger() {
        this.setData({
            status: !this.data.status
        })
    },
    // 减少
    reduce(e) {
        let count
        let id = app.getValue(e).id
        let sid = app.getValue(e).sid

        let newArr = this.data.arr;
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                if (element[j].commodityId == id) {
                    if (element[j].amount > 1) {
                        element[j].amount -= 1
                        count = element[j].amount
                    } else {
                        wx.showToast({
                            title: '商品数量最少一件！',
                            icon: 'none'
                        })
                        return false
                    }
                }
            }
        }
        this.setData({
            arr: newArr
        })
        this.totalNum()
        api.changeNum({
            amount: count,
            shoppingTrolleyId: sid
        }).then(res => {
            // console.log(res)
            /* if (res.status == 200) {
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
            } */
        })
    },
    // 增加
    add(e) {
        let count
        let id = app.getValue(e).id
        let sid = app.getValue(e).sid
        let newArr = this.data.arr;
        for (let i = 0; i < newArr.length; i++) {
            let element = newArr[i].commodityDtoList
            for (let j = 0; j < element.length; j++) {
                if (element[j].commodityId == id) {
                    if (element[j].amount < 99) {
                        element[j].amount += 1
                        count = element[j].amount
                    } else {
                        wx.showToast({
                            title: '最多只能买99件哦！',
                            icon: 'none'
                        })
                        return false
                    }
                }
            }
        }
        this.setData({
            arr: newArr
        })
        this.totalNum()
        api.changeNum({
            amount: count,
            shoppingTrolleyId: sid
        }).then(res => {
            // console.log(res)
            /* if (res.status == 200) {
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
            } */
        })
    },
    detail(e){
        const id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/goodsDe/index?id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.checkUser()
        this.setData({
            baseURL,
            imgBaseUrl
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
        this.refresh()
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
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
                this.myCart()
            } else {

            }
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})