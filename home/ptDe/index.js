import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../utils/http"
let app = getApp();
let timer
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isRequest1: false,
        nowTime: "",
        selectIndex: '',
        specificationId: null,
        swiperIndex: 0,
        choseAddressIndex: 0,
        skuIndex: 0,
        goodNum: 1,
        addressShow: false,
        hasAddress: false,
        goodSizeShow: false,
        surePtShow: false,
        mask: false,
        poster: false,
        modal: false,
      groupType:0
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
            // modal: true,
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
      console.log("生成海报")
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
        // this.setData({
        //     poster: true,
        //     share: false
        // })
        // this.draw()
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
        const id = options.id //拼团id
        this.setData({
            baseURL,
            imgBaseUrl,
            id,
            userId: wx.getStorageSync('userId'),
            nowTime: new Date().getTime(),
            imgUrl
        })
        this.reduce()
    },
    // 拼团详情
    detail() {
        api.groupBookingDetail({
            bookingId: this.data.id
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                oneBookingSum: data.oneBookingSum,
                urlList: data.urlList,
                commodityId: data.commodityId,
                groupUserDtoList: data.groupUserDtoList, //参加拼团列表
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
                marketPrice: data.marketPrice // 市场价格
            })
        })
    },
    // 发起拼团
    booking1() {
        app.checkUser()
        api.createCommodityOrder({
            orderType: 1,
            bookingId: this.data.id
        }).then(res => {
            console.log(res)
            if(res.status == 500){
                wx.showToast({
                  title: res.msg,
                  icon : 'none'
                })
                return 
            }

            let id = res.data.orderId
            wx.navigateTo({
                url: `/pages/self/ptDetail/index?id=${id}`,
            })
        })
    },
    // 关闭弹框
    closeModal() {
        this.setData({
            mask: false,
            modal: false
        })
    },
    // 去拼团 弹框
    goBooking(e) {
        const index = app.getValue(e).index
        
        let arr = this.data.groupUserDtoList
        let userIds = arr[index].userIds
        const bookingId = arr[index].bookingId
        const groupUserId = arr[index].groupUserId
      const groupType = arr[index].groupType

        api.getAllGroupUser({
            groupUserId
        }).then(res=>{
            console.log(res)
            this.setData({
                groupList : res.data,
                mask: true,
                modal: true,
                bookingId,
                groupUserId,
                userIds,
                groupType,
                selectIndex: index
            })
        })
    },
    // 参与拼图
    booking() {
        app.checkUser();
        api.createCommodityOrder({
            orderType: 1,
            bookingId: this.data.id,
            groupUserId: this.data.groupUserId
        }).then(res => {
            console.log(res)
            this.setData({
                modal: false,
                mask: false
            })
            let id = res.data.orderId
            wx.navigateTo({
                url: `/pages/self/ptDetail/index?id=${id}`,
            })
        })
        /* api.addGroupBooking({
            bookingId: this.data.id,
            groupUserId: this.data.groupUserId
        }).then(res => {
            if (res.status == 200) {
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
            }
            this.detail()
        }) */
    },
    // 拼团列表
    bookingList() {
        const id = this.data.id
        wx.navigateTo({
            url: `/pages/ptDe/bookingList/index?id=${id}`,
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
        this.detail()
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
})