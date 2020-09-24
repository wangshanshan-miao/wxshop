// pages/index/product/product.js
import api from "../../../utils/api.js"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http.js"
let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        typeIndex: -1,
        value: "",
        id : ''
        // chiTypeIndex: 0
    },
    // 输入
    inputValue(e) {
        this.setData({
            value: e.detail.value
        })
    },
    // 清除
    clear() {
        this.setData({
            value: ""
        })
    },
    // 获取数组
    getArr() {
        api.getDictValue({
            dataType: "life_store_type"
        }).then(res => {
            console.log(res)
            this.setData({
                arr: res.data.slice(2)
            })
        })
    },
    // 获取二级分类 -1 全部 
    category(type) {
        api.buildinglList({
            "areaCode": wx.getStorageSync('areaCode'),
            "merchantType": type,
            "allianceId" : this.data.id,
            "pageNum": 1,
            // "pageSize": 10
        }).then(res => {
            // console.log(res.data.list)
            this.setData({
                categories: res.data.list
            })
        })
    },
    // 进入产品详情
    detail(e){
        const id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/goodsDe/index?id=${id}`,
        })
    },
    // 搜索
    search() {
        const value = this.data.value.trim()
        const type = this.data.typeIndex
        if (value) {
            api.buildinglList({
                "areaCode": wx.getStorageSync('areaCode'),
                "merchantType": type,
                "history": value
            }).then(res => {
                // console.log(res.data.list)
                this.setData({
                    categories: res.data.list
                })
            })
        }else{
            wx.showToast({
              title: '请输入搜索内容',
              icon : "none"
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl,
            id : options.id,
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
        this.getArr()
        this.category(-1)
    },
    choseType(e) {
        this.setData({
            typeIndex: app.getValue(e).index
        })
        this.category(app.getValue(e).key)
    },
    /* cahngeChiType(e) {
        this.setData({
            chiTypeIndex: app.getValue(e).index
        })
        this.category(app.getValue(e).key)
    } */
})