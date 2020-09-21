// pages/goodsDe/index.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../utils/http"

let app = getApp();
let timer

Page({
    /**
     * 页面的初始数据
     */
    data: {
        goodNum: 1,
        goodSizeShow1: false,
        diff: true,
        endTime: '',
        process: '',
        precent: '',
        toSelectAddress: false,
        selectIndex: null,
        addressPhone: '',
        addressName: '',
        codeName: '',
        areaCode: '',
        receiverAddress: '',
        cityCode: null,
        region: [],
        id: '',
        specificationId: null,
        swiperIndex: 0,
        choseAddressIndex: 0,
        skuIndex: 0,
        goodNum: 1,
        addressShow: false,
        hasAddress: false,
        goodSizeShow: false,
        surePtShow: false,
        modal: false,
        unit: '',
        addressList: [] // 收货地址列表
    },
    reduceNum() {
        app.checkUser()
        if (this.data.goodNum <= 1) {
            wx.showToast({
                title: '商品数量不可以小于1件',
                icon: 'none',
                duration: 1500,
            });
            return false
        }
        this.setData({
            goodNum: this.data.goodNum - 1
        })
    },
    addNum() {
        app.checkUser()
        const num = this.data.goodNum
        const limit = this.data.restriction
        if (num < (this.data.inventory - this.data.num)) {
            if (num < limit) {
                this.setData({
                    goodNum: this.data.goodNum + 1
                })
            } else {
                wx.showToast({
                    title: `该商品限购${limit}件！`,
                    icon: 'none'
                })
            }
        } else {
            wx.showToast({
                title: '库存不足！',
                icon: 'none'
            })
        }

    },
    close1() {
        this.setData({
            goodSizeShow1: false
        })
    },
    reduce() {
        const self = this
        timer = setInterval(() => {
            let endTime = this.data.endTime
            let diff = endTime - new Date().getTime()
            if (diff <= 0) {
                clearInterval(timer)
                self.setData({
                    diff: false
                })
                wx.navigateBack()
                return
            }
            self.setData({
                nowTime: new Date().getTime()
            })
        }, 1000);
    },
    // 分享弹框
    sharegood() {
        this.setData({
            modal: true,
            share: true
        })
    },
    closeShare() {
        this.setData({
            modal: false,
            share: false
        })
    },
    hiddlePoster() {
        wx.setStorageSync('bgImg', imgBaseUrl + this.data.coverUrl);
        wx.setStorageSync('goodName', this.data.commodityName);
        wx.setStorageSync('price', this.data.salePrice);
        wx.setStorageSync('unit', this.data.unit ? this.data.unit : '');
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
    // 生成海报弹框
    makePoster() {
        this.setData({
            poster: true,
            share: false
        })
        this.draw()
    },
    // canvas 生成图片路径
    makeTempFilePath() {
        const self = this
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 572,
            height: 888,
            destWidth: 572,
            destHeight: 888,
            canvasId: 'myCanvas',
            canvas: this.data.canvas,
            success(res) {
                // console.log(res.tempFilePath)
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                        })
                        self.setData({
                            modal: false,
                            poster: false
                        })
                    }
                })
            },
            fail(res) {
                console.log(res)
            }
        })
    },
    // canvas 保存图片
    savePoster() {
        this.makeTempFilePath()
    },
    // canvas 画图
    draw() {
        var query = wx.createSelectorQuery();     //选择id   
        // query.select('.card').boundingClientRect(function (rect) {

        //   let ctxwidth = rect.width;
        //   let ctxheight = rect.height;

        // }).exec();
        const self = this
        const url = imgBaseUrl + this.data.coverUrl
        const text = this.data.commodityName
        const ctx = wx.createCanvasContext('myCanvas')
        let title = "title"
        let str = `海报分享`
        let message = `长按识别小程序码，体验智能选照`
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, 10, ctxheight)
        ctx.setFontSize(18);
        ctx.setFillStyle('#333');          // 剩余宽度50%开始绘制文字   
        ctx.fillText(title, (ctxwidth - ctx.measureText(title).width) * 0.5, 28);
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.fillText(str, (ctxwidth - ctx.measureText(str).width) * 0.5, 50);

    },
    closePoster() {
        this.setData({
            poster: false,
            modal: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.id)
        const id = options.id //秒杀id
        this.setData({
            baseURL,
            imgBaseUrl,
            id,
            nowTime: new Date().getTime()
        })
        this.reduce()
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
        this.getDetail()
        this.address()
    },
    // 选择收货地址
    selectAddress(e) {
        const index = app.getValue(e).index
        const addressId = app.getValue(e).id
        // console.log(index)
        this.setData({
            selectIndex: index,
            addressId
        })
    },
    // 秒杀详情
    getDetail() {
        api.seckillDetail({
            seckillCommodityId: this.data.id
        }).then(res => {
            const data = res.data
            this.setData({
                restriction: data.restriction, // 限购
                endTime: data.endTime,
                urlList: data.urlList,
                commodityId: data.commodityId,
                commodityName: data.commodityName,
                subscriptionPrice: data.subscriptionPrice, // 定金
                evaluateContent: data.evaluateContent,
                evaluateSum: data.evaluateSum,
                headUrl: data.headUrl,
                coverUrl: data.coverUrl,
                merchantId: data.merchantId,
                userName: data.userName,
                commodityContent: data.commodityContent,
                salePrice: data.salePrice, // 销售价格
                marketPrice: data.marketPrice, // 市场价格
                num: data.num, // 已售
                unit: data.unit, // 已售
                inventory: data.inventory, // 总量库存
                precent: Math.ceil((data.inventory - data.num) / data.inventory * 100)
            })
        })
    },

    // 去店铺
    goStore() {
        const id = this.data.merchantId
        wx.navigateTo({
            url: `/pages/store/store?id=${id}`,
        })
    },
    // 全部评价
    goAllEva() {
        const id = this.data.id
        wx.navigateTo({
            url: `../alleva/index?id=${id}`,
        });
    },
    swiperChange(e) {
        this.setData({
            swiperIndex: e.detail.current
        })
    },
    // 收货地址列表
    address() {
        api.getAddressList({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            this.setData({
                addressList: res.data.list
            })
        })
    },
    selectNum() {
        this.setData({
            goodSizeShow1: true
        })
    },
    // 立即购买
    buyNow() {
        app.checkUser()

        if (!this.data.diff) {
            wx.showToast({
                title: '活动已经结束',
                icon: 'none'
            })
            return false
        }
        // 生成商品订单
        api.createCommodityOrder({
            orderType: 2,
            seckillCommodityId: this.data.id,
            amount: this.data.goodNum
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                this.setData({
                    goodSizeShow1: false
                })
                let id = res.data.orderId
                wx.navigateTo({
                    url: `/pages/self/ptDetail/index?id=${id}`,
                })
            }
        })
    },
    closeAddress() {
        this.setData({
            hasAddress: false,
            modal: false,
            addressShow: false,
            toSelectAddress: false
        })
    },
    closeModal() {
        this.setData({
            model: false
        })
    },
    addAddress() {
        this.setData({
            addressShow: true,
            hasAddress: false
        })
    },
    // 选择区域
    selectArea(e) {
        let code = e.detail.code.pop()
        this.setData({
            region: e.detail.value,
            areaCode: code,
            codeName: e.detail.value.join("")
        })
    },
    // 确认收货地址
    confirm() {
        const addressId = this.data.addressId
        if (!addressId) {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none'
            })
            return
        }
        this.closeAddress()

    },
    // 新增收货地址
    save() {
        const codeName = this.data.codeName
        const addressPhone = this.data.addressPhone
        const addressName = this.data.addressName
        const receiverAddress = this.data.receiverAddress
        if (!(codeName && addressPhone && addressName && receiverAddress)) {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none'
            })
            return false
        }
        api.addAddress({
            userId: wx.getStorageSync('userId'),
            areaCode: this.data.areaCode,
            addressName,
            addressPhone,
            codeName,
            receiverAddress,
            def: 1
        }).then(res => {
            if (res.status == 200) {
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
            }
            // 新增之后去选择收货地址
            this.setData({
                toSelectAddress: true,
                addressShow: false,
                modal: true
            })
        })
    },
    inputName(e) {
        this.setData({
            addressName: e.detail.value.trim()
        })
    },
    checkPhone(e) {
        let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (reg.test(e.detail.value)) {
            this.setData({
                addressPhone: e.detail.value
            })
        } else {
            this.setData({
                addressPhone: ''
            })
        }
    },
    inputAddress(e) {
        this.setData({
            receiverAddress: e.detail.value.trim()
        })
    },
})