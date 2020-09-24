// pages/goodsDe/index.js
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
        urlList: [],
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
        addressList: [],// 收货地址列表
        poster: false,
        unit: ""
    },
    hiddlePoster() {
        console.log("生成海报")
        wx.setStorageSync('bgImg', imgBaseUrl + this.data.coverUrl);
        wx.setStorageSync('goodName', this.data.commodityName);
        wx.setStorageSync('price', this.data.fixedPrice);
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
        const self = this
        const url = imgBaseUrl + this.data.coverUrl
        const text = this.data.commodityName
        wx.createSelectorQuery().select('#myCanvas')
            .fields({
                node: true, // canvas 实例
                size: true // 节点宽高
            })
            .exec((res) => {
                let canvas = res[0].node
                let ctx = canvas.getContext('2d')
                let width = res[0].node.width
                let height = res[0].node.height
                self.setData({
                    canvas,
                    ctx
                })
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)

                ctx.save() // 保存绘画状态

                // 绘制白色背景
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, width, height)

                ctx.restore()

                // 绘制图片
                const img = canvas.createImage()
                img.onload = () => {
                    ctx.drawImage(img, 0, 16, width, 203)
                }
                img.src = url

                const img1 = canvas.createImage()
                img1.onload = () => {
                    ctx.drawImage(img1, 8, 231, 33, 11)
                }
                img1.src = 'https://www.deejv.com/unite/upload/2020330/1585556759866198243366.png'

                const img2 = canvas.createImage()
                img2.onload = () => {
                    ctx.drawImage(img2, 192, 305, 80, 75)
                }
                // 小程序二维码
                img2.src = 'http://118.89.53.192:3002/public/uploads/upload_580400e3dbb9531fb6df53c5481689bb.jpg'

                // 绘制文本
                ctx.font = "9px";
                ctx.fillText(text, 55, 241);

                ctx.font = "10px";
                ctx.fillText("长按识别小程序", 23, 311);
            })
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
        const id = options.id
        this.setData({
            baseURL,
            imgBaseUrl,
            id,
            imgUrl
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    checkUser() {
        app.checkUser()
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
    // 详情
    getDetail() {
        api.clearanceSaleDetail({
            clearanceSaleId: this.data.id
        }).then(res => {
            const data = res.data
            this.setData({
                urlList: data.urlList,
                surplusAmount: data.surplusAmount,
                commodityId: data.commodityId,
                commodityName: data.commodityName,
                fixedPrice: data.fixedPrice, // 一口价
                evaluateContent: data.evaluateContent,
                evaluateSum: data.evaluateSum,
                headUrl: data.headUrl,
                coverUrl: data.coverUrl,
                merchantId: data.merchantId,
                userName: data.userName,
                commodityContent: data.commodityContent,
                unit: data.unit
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
    // 立即购买
    buyNow() {
        this.checkUser()
        /* const addressList = this.data.addressList
        if (!addressList) {
            this.setData({
                hasAddress: true,
                modal: true
            })
        } else {
            this.setData({
                toSelectAddress: true,
                modal: true
            })
        } */
        api.createCommodityOrder({
            orderType: 3,
            clearanceSaleId: this.data.id
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
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

        // 购买
        api.createCommodityOrder({
            orderType: 3,
            userId: wx.getStorageSync('userId'),
            merchantId: this.data.merchantId,
            amounts: [1]
        }).then(res => {
            console.log(res)
        })

    },
    // 新增收货地址
    save() {
        this.checkUser()
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