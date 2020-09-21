// pages/index/ms/ms.js
import api from "../../utils/api.js"
import {
    baseURL,
    imgBaseUrl
} from "../../utils/http.js"
let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        markers: [{
            id: 0,
            latitude: '',
            longitude: '',
            width: 50,
            height: 50,
            label: {
                content: '',
                color: '#000000',
                fontSize: "14",
                bgColor: '#ffffff',
                padding: '10',
                textAlign: 'center',
                anchorX: '-40',
                anchorY: '-80'
            }
        }],

        showEwm: false,
        showShare: false,
        dataImg: [],
        tabIndex: 0,
        typeIndex: -1,
        tab: [
            '商品', '优惠', '商户简介', '案例展示'
        ],
        merchantId: null,
        // 二级分类id
        commoditySonClass: "",
        value: "",
        isRequest: false,
        pageNum: 1,
        couponList: [], // 优惠
        arr: [], // 商品
        typeList: [],
        typeTwoIndex: 100,
        poster: false,
        modal: false,
        share: false
    },
    markertap(e) {
        console.log('路线规划')
        this.gps()
    },
    save() {
        const url = imgBaseUrl + this.data.detail.wechatQrCodeUrl
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    // 二级分类切换
    changeTwoGoodType(e) {
        this.setData({
            typeTwoIndex: app.getValue(e).index,
            commoditySonClass: app.getValue(e).id,
            pageNum: 1,
            isRequest: false,
            arr: [],
        })
        this.category();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.id)
        options.id && this.setData({
            merchantId: options.id
        })
        this.setData({
            baseURL,
            imgBaseUrl
        })
    },

    closeShare() {
        this.setData({
            showShare: false
        })
    },
    // 路线规划
    gps() {
        let address = this.data.detail.merchantAddress
        let latitude = parseFloat(this.data.detail.lat)
        let longitude = parseFloat(this.data.detail.lng)
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success(res) {
                wx.openLocation({
                    name: address,
                    address,
                    latitude,
                    longitude,
                    scale: 18
                })
            }
        })

        /* let plugin = requirePlugin('routePlan');
        let key = 'AHWBZ-SWMK4-B7OUQ-XGISN-DVUWT-E7F3F'; 
        let referer = '点吉家装建材商城'; 
        let endPoint = JSON.stringify({ 
            'name': address,
            'latitude': this.data.detail.lat,
            'longitude': this.data.detail.lng
        });
        wx.navigateTo({
            url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        }); */
    },
    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.tel
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
        this.swiper()
        this.setData({
            couponList: [],
            pageNum: 1,
            arr: [],
            isRequest: false
        })
        const merchantId = this.data.merchantId
        api.merchantDetail({
            merchantId
        }).then(res => {
            console.log(res)
            const data = res.data.merchant
            this.setData({
                'markers[0].latitude': data.lat,
                'markers[0].longitude': data.lng,
                'markers[0].label.content': data.merchantName,
                tel: res.data.merchant.merchantTel,
                isCollect: res.data.isCollect,
                list: res.data.classList,
                intro: res.data.merchant.merchantIntro,
                detail: res.data.merchant,
                imgs: res.data.merchant.realisticPicture.split(","),

            })
            this.category()
        })
        this.caseList()
        this.voucherList()
    },
    // 预览
    preview(e) {
        const url = app.getValue(e).url
        console.log(url)
        wx.previewImage({
            current: imgBaseUrl + url, // 当前显示图片的http链接
            urls: [imgBaseUrl + url] // 需要预览的图片http链接列表
        })
    },
    // 轮播图
    swiper() {
        api.getSwiper({
            areaCode: wx.getStorageSync('areaCode'),
            newBy: this.data.merchantId
        }).then(res => {
            this.setData({
                dataImg: res.data.carouselList
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
                if (this.data.tabIndex == 1) {
                    this.voucherList()
                } else {
                    this.category()
                }
            } else {

            }
        }
    },
    // 清除
    clear() {
        this.setData({
            value: ""
        })
    },
    // 输入
    inputValue(e) {
        this.setData({
            value: e.detail.value
        })
    },
    // 搜索
    search() {
        const merchantId = this.data.merchantId
        const value = this.data.value.trim()
        const type = this.data.type
        if (value) {
            api.searchGoods({
                merchantId,
                commodityName: value,
                commodityClass: type,
                pageSize: 10
            }).then(res => {
                console.log(res)
                this.setData({
                    arr: res.data.list,
                    value: ''
                })
            })
        } else {
            wx.showToast({
                title: '请输入搜索内容',
                icon: "none"
            })
        }
    },
    // 分类
    category() {
        const merchantId = this.data.merchantId
        const type = this.data.type
        const arr = this.data.arr
        wx.showLoading({
            title: '加载中...',
        })
        api.searchGoods({
            merchantId,
            commodityClass: type,
            commoditySonClass: this.data.commoditySonClass,
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
    // 商家详情
    getDetail() {
        const merchantId = this.data.merchantId
        api.merchantDetail({
            merchantId
        }).then(res => {
            console.log(res)
            this.setData({
                list: res.data.classList,
                type: res.data.classList[0].classId
            })
        })
    },
    // 优惠
    voucherList() {
        const arr = this.data.couponList
        wx.showLoading({
            title: '加载中...',
        })
        api.getVoucherList({
            areaCode: wx.getStorageSync('areaCode'),
            merchantId: this.data.merchantId,
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                couponList: [...arr, ...data.list],
                isRequest: false
            })
            wx.hideLoading({})
        })
    },
    // 代金券详情
    couponDetail(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/self/yhq/detail/index?id=${id}&state=1`,
        })
    },
    // 案例详情
    goAlxq(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/index/alxq/alxq?id=${id}`,
        })
    },
    // 案例展示
    caseList() {
        const merchantId = this.data.merchantId
        api.getCaseList({
            merchantId,
            pageNum: 1,
            pageSize: 10
        }).then(res => {
            // console.log("案例展示", res)
            const arr = res.data.list
            this.setData({
                caseList: arr,
            })
        })
    },
    checkUser() {
        app.checkUser()
    },
    // 收藏商家
    collet() {
        this.checkUser()
        api.collect({
            collectType: 1,
            merchantId: this.data.merchantId
        }).then(res => {
            // console.log(res)
            if (this.data.isCollect == 0) {
                wx.showToast({
                    title: '收藏成功',
                    icon: "none"
                })
                this.setData({
                    isCollect: 1
                })
            } else {
                wx.showToast({
                    title: '取消收藏',
                    icon: "none"
                })
                this.setData({
                    isCollect: 0
                })
            }
        })
    },
    // 加入购物车
    /* buy(e) {
        const id = app.getValue(e).id
        console.log("商品id", id)
    }, */
    // tab切换
    choseType(e) {
        this.setData({
            tabIndex: app.getValue(e).index,
            pageNum: 1,
            isRequest: false
        })
        if (this.data.tabIndex == 1) {
            this.setData({
                couponList: []
            })
            this.voucherList()
            return
        }
        if (this.data.tabIndex == 0) {
            this.setData({
                arr: []
            })
            this.category()
            return
        }
    },
    // 切换商品类型
    changeGoodType(e) {
        this.setData({
            typeIndex: app.getValue(e).index,
            commoditySonClass: '',
            typeTwoIndex: 100,
            type: app.getValue(e).id,
            pageNum: 1,
            isRequest: false,
            arr: [],
            typeList: app.getValue(e).item ? app.getValue(e).item.sClassList.length != 0 ? app.getValue(e).item.sClassList : [] : []
        })
        this.category();

    },
    closeModel() {
        this.setData({
            showEwm: false
        })
    },
    showModel() {
        this.setData({
            showEwm: true
        })
    },
    showShare() {
        this.setData({
            showShare: !this.data.showShare,

        })
    },
    // 商品详情
    goGoodDe(e) {
        const merchantId = this.data.merchantId
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `../goodsDe/index?id=${id}&merchantId=${merchantId}`,
        });
    },
    makePoster() {
        console.log(imgBaseUrl + this.data.detail.logoUrl, this.data.detail.merchantName);
      wx.removeStorageSync('price');
      wx.removeStorageSync('unit');
        wx.setStorageSync('bgImg', imgBaseUrl + this.data.detail.logoUrl);
        wx.setStorageSync('goodName', this.data.detail.merchantName);
        api.getinviteCode({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            wx.setStorageSync('userInvite', imgBaseUrl + res.data);
            this.setData({
                poster: !this.data.poster,
                modal: false,
                share: false
            })
        })



    },
})