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
        currentPrice: null, // 所选商品的价格
        cityCode: null,
        region: [],
        toSelectAddress: false,
        status: null,
        specificationId: null,
        swiperIndex: 0,
        choseAddressIndex: null,
        skuIndex: null,
        goodNum: 1,
        addressShow: false,
        hasAddress: false,
        goodSizeShow: false,
        surePtShow: false,
        goodSizeShow1: false,
        modal: false,
        share: false,
        poster: false,
        count_down: '',
        endTime: ''
    },
    goBuyCar() {
        wx.navigateTo({
            url: '/pages/buyCar/index/car',
        })
    },
    goTalk() {
      wx.navigateTo({
        url: '/pages/talk/index',
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
        console.log("生成海报")
        wx.setStorageSync('bgImg', imgBaseUrl + this.data.detail.coverUrl);
        wx.setStorageSync('goodName', this.data.detail.commodityName);
        wx.setStorageSync('price', this.data.detail.salePrice);
        wx.setStorageSync('unit', this.data.detail.unit ? this.data.detail.unit : '');
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
                console.log(res.tempFilePath)
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
    // 预览图片
    preview() {
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
                wx.previewImage({
                    urls: res.tempFilePath,
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
        // const url = baseURL + this.data.detail.coverUrl
        const url = imgBaseUrl + this.data.detail.coverUrl
        const text = this.data.detail.commodityName
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

                ctx.save()


                // 绘制白色背景
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, 286, 444)

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
        const id = Number.parseInt(options.id) //商品id
        const goodType = Number.parseInt(options.type) //商品类型
        const merchantId = options.merchantId //商家id
        this.setData({
            baseURL,
            imgBaseUrl,
            id,
            merchantId,
            goodType
        })
    },
    checkUser() {
        app.checkUser()
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
        this.goodDetail()
        this.specification()
        this.address()
    },
    onHide() {
      clearInterval(timer)
    },
  // 设置时间
  date_format: function (endTime) {
    var nowTime = new Date().getTime();//现在时间（时间戳）
    var endTime = new Date(endTime).getTime();//结束时间（时间戳）
    var time = (endTime - nowTime) / 1000
    // 获取天、时、分、秒
    let day = this.fill_zero_prefix(parseInt(time / (60 * 60 * 24)));
    let hr = this.fill_zero_prefix(parseInt(time % (60 * 60 * 24) / 3600));
    let min = this.fill_zero_prefix(parseInt(time % (60 * 60 * 24) % 3600 / 60));
    let sec = this.fill_zero_prefix(parseInt(time % (60 * 60 * 24) % 3600 % 60));

    this.setData({
      count_down: day + ":" + hr + ":" + min + ":" + sec,
      count_down1: day + "天" + hr + "时" + min + "分" + sec + "秒"
    })
  },
    // 位数不足补零
    fill_zero_prefix: function (num) {
      num = num < 0 ? 0 : num;//防止出现负数
      return num < 10 ? "0" + num : num //补零操作
    },
    countDown() {
      // 获取当前时间，同时得到活动结束时间数组
      let newTime = new Date().getTime();
      let endTimeList = this.data.actEndTimeList;
      let countDownArr = [];

      // 对结束时间进行处理渲染到页面
      endTimeList.forEach(o => {

        let endTime = new Date(o.eTime).getTime();
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
          let time = (endTime - newTime) / 1000;
          // 获取天、时、分、秒
          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          obj = {
            day: this.fill_zero_prefix(day),
            hou: this.fill_zero_prefix(hou),
            min: this.fill_zero_prefix(min),
            sec: this.fill_zero_prefix(sec)
          }
        } else { //活动已结束，全部设置为'00'
          obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
          }
        }
        countDownArr.push(obj);
      })
      // 渲染，然后每隔一秒执行一次倒计时函数
      this.setData({
        countDownList: countDownArr
      })
      setTimeout(this.countDown, 1000);
    },
    // 商品详情
    goodDetail() {
        if (this.data.goodType == 0) { // 限时秒杀
          api.seckillDetail({
            outId: this.data.id
            // outId: 38
          }).then(res => {
            if (res.status == 200) {
              console.log(res)
              this.setData({
                detail: res.data,
                currentPrice: res.data.salePrice,
                merchantId: res.data.merchantId,
                evaluateLevel: Number(res.data.evaluateLevel),
                endTime: res.data.endTime
              })
              timer = setInterval(() => {
                this.date_format(this.data.endTime)
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
            }
          })
        } else if (this.data.goodType == 1) { // 拼团
          api.groupDetail({
            outId: this.data.id
            // outId: 70
          }).then(res => {
            if (res.status == 200) {
              console.log(res)
              this.setData({
                detail: res.data,
                currentPrice: res.data.salePrice,
                merchantId: res.data.merchantId,
                evaluateLevel: Number(res.data.evaluateLevel),
                groupUserDtoList: res.data.groupUserDtoList
              })
              const endTimeList = []

              for (var i = 0; i < this.data.groupUserDtoList.length; i++) {
                var objs = {};
                objs.eTime = this.data.groupUserDtoList[i].endTime
                endTimeList.push(objs)
              }
              this.setData({
                actEndTimeList: endTimeList
              });
              this.countDown();
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
            }
          })
        } else if (this.data.goodType == 2) { // 清仓
          api.clearDetail({
            // outId: this.data.id
            outId: 34
          }).then(res => {
            if (res.status == 200) {
              console.log(res)
              this.setData({
                detail: res.data,
                currentPrice: res.data.salePrice,
                merchantId: res.data.merchantId,
                evaluateLevel: Number(res.data.evaluateLevel)
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
            }
            
          })
        } else {
          api.goodDetail({
            // outId: this.data.id
            outId: 100
          }).then(res => {
            if (res.status == 200) {
              console.log(res)
              this.setData({
                detail: res.data,
                currentPrice: res.data.salePrice,
                merchantId: res.data.merchantId,
                status: res.data.appointmentType, //0 不可以预约测量  1 可以预约
                evaluateLevel: Number(res.data.evaluateLevel)
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
            }
          })
        }

    },
    // 收藏商品
    collect() {
        this.checkUser()
        api.collect({
            commodityId: this.data.id,
            userId: wx.getStorageSync('userId'),
            collectType: 0
        }).then(res => {
            console.log(res)
            if (this.data.isCollect == 0) {
                wx.showToast({
                    title: '收藏成功',
                    icon: "none"
                })
            } else {
                wx.showToast({
                    title: '取消收藏',
                    icon: "none"
                })
            }
            this.goodDetail()
        })
    },
    // 收获地址列表
    address() {
        api.getAddressList({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            this.setData({
                addressList: res.data.list
            })
        })
    },
    // 预约测量
    createMetricalOrder() {
        this.checkUser()
        const addressId = this.data.addressId
        if (!addressId) {
            wx.showToast({
                title: '请选择测量地址',
                icon: 'none'
            })
            return false
        }
        api.createMetricalOrder({
            commodityId: this.data.id,
            merchantId: this.data.merchantId,
            addressId,
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                /* wx.showToast({
                    title: '预约成功',
                    icon: "none"
                })
                this.setData({
                    status: '1'
                }) */
                wx.navigateTo({
                    url: `/pages/self/clorder/index`,
                })
            }
        })
    },
    // 商品规格
    specification() {
        api.commoditySpecification({
          outId: this.data.id
        }).then(res => {
            console.log(res)
            const data = res.data
            this.setData({
                good: data,
                /* specificationId: data.commoditySpecificationList[0].commoditySpecificationId */
            })
        })
    },
    // 去拼团
    // 去拼团 弹框
    goBooking(e) {
      const index = app.getValue(e).index

      let arr = this.data.detail.groupUserDtoList
      // let userIds = arr[index].userIds
      const bookingId = arr[index].bookingId
      const groupUserId = arr[index].groupUserId
      const groupType = arr[index].groupType
      const endtimes = this.data.countDownList[index]

      api.getAllGroupUser({
        groupUserId
      }).then(res => {
        console.log(res)
        this.setData({
          groupList: res.data,
          mask: true,
          modal: true,
          bookingId,
          groupUserId,
          // userIds,
          groupType,
          selectIndex: index,
          endtimes
        })
      })
    },
    // 关闭弹框
    closeModal1() {
      this.setData({
        mask: false,
        modal: false
      })
    },
    // 去店铺
    goStore() {
        const id = this.data.merchantId
        wx.navigateTo({
            url: `/pages/store/store?id=${id}`,
        })
    },
    // 选择收货地址
    selectAddress(e) {
        const index = app.getValue(e).index
        const addressId = app.getValue(e).id
        this.setData({
            selectIndex: index,
            addressId,
        })
    },
    // 切换规格
    switch(event) {
      const index = event.currentTarget.dataset.index
      const specificationId = event.currentTarget.dataset.commodityspecificationid
      const price = event.currentTarget.dataset.p
        this.setData({
          currentPrice: price,
          skuIndex: index,
          specificationId: specificationId //规格id
        })
    },
    // 加入购物车
    addToCart() {
        this.checkUser()
        let specificationId = this.data.specificationId
        if (this.data.good.commoditySpecificationList.length > 0) {
            if (!specificationId) {
                wx.showToast({
                    title: '请选择商品规格',
                    icon: 'none'
                })
                return false
            }
        }
        api.addToCart({
          commoditySpecificationId: this.data.specificationId,
          amount: this.data.goodNum,
          outId: this.data.id,
          userId: wx.getStorageSync("userId")
        }).then(res => {
          this.setData({
            goodSizeShow: false
          })
          if (res.status == 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            return
          }
            /* wx.switchTab({
                url: `/pages/buyCar/index/car`
            }) */
        })
    },
    // 关闭购买时选择规格和数量弹框
    close1() {
        this.setData({
            goodSizeShow1: false
        })
    },
    changeAddress(e) {
        this.setData({
            choseAddressIndex: app.getValue(e).index,
            addressId: app.getValue(e).id
        })
    },
    goAllEva(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `../alleva/index?id=${id}`,
        });
    },
    close_ptShow() {
        this.setData({
            surePtShow: false
        })
    },
    swiperChange(e) {
        this.setData({
            swiperIndex: e.detail.current
        })
    },
    reduceNum() {
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
        this.setData({
            goodNum: this.data.goodNum + 1
        })
    },
    addCar() {
        this.checkUser()
        this.setData({
            goodSizeShow: true,
            btnText: '加入购物车'
        })
    },
    // 预约测量按钮
    budget() {
        this.checkUser()
        const addressList = this.data.addressList
        // 收获地址不存在 添加收获地址
        if (!addressList.length) {
            this.setData({
                addressShow: true,
                modal: true
            })
            // 选择收获地址
        } else {
            this.setData({
                toSelectAddress: true,
                modal: true
            })
        }
    },
    // 关闭所有弹框
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
        this.createMetricalOrder()
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
                this.address()
                // 新增之后去选择收货地址
                this.setData({
                    toSelectAddress: true,
                    addressShow: false,
                    modal: true
                })
            }
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
    close_goodSizeShow() {
        this.setData({
            goodSizeShow: false
        })
    },
    closeAddAddress() {
        this.setData({
            addressShow: false,
            hasAddress: false
        })
    },
    buyNow() {
        this.checkUser()
        this.setData({
            goodSizeShow1: true,
            btnText: '立即购买'
        })
    },
    // 选择商品规格和数量，确认后购买 -> 生成商品订单
    buy() {
        if (this.data.good.commoditySpecificationList.length == 0) {
            this.setData({
                specificationId: -1
            })
        }
        let specificationId = this.data.specificationId
        if (!specificationId) {
            wx.showToast({
                title: '请选择商品规格',
                icon: 'none'
            })
            return false
        }
        api.createCommodityOrder({
            orderType: 0,
            merchantId: this.data.merchantId,
            commodityIds: [this.data.id],
            commoditySpecificationIds: [specificationId],
            amounts: [this.data.goodNum]
        }).then(res => {
            // console.log(res)
            this.setData({
                goodSizeShow1: false
            })
            let id = res.data.orderId
            wx.navigateTo({
                url: `/pages/self/ptDetail/index?id=${id}`,
            })
        })
    },
    showPt() {
        this.setData({
            surePtShow: !this.data.surePtShow
        })
    },
    choseArea(e) {
        console.log(e);
    }
})