//index.js
//获取应用实例
import api from "../../../utils/api.js"
import {
  baseURL,
  imgBaseUrl,
  imgUrl
} from "../../../utils/http.js"
import {
  formatTimes
} from "../../../utils/util.js"
// 引入SDK核心类
var QQMapWX = require('../../../qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'SNHBZ-TN6L3-7Y634-YHROL-PHCNO-PLFTP' // 必填
});

let timer

let timer1

const app = getApp()

Page({
  data: {
    poster: false,
    location: '',
    getuserInfo: false,
    show: false,
    modal: false,
    gift: false,
    imgArr: [],
    openid: "",
    userName: "",
    userPhone: "",
    headUrl: " ",
    inviterId: "",
    content: "",
    marqueePace: 0.5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 0,
    size: 24,
    interval: 25, // 时间间隔
    swiper: {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      current: 0
    },
    goodSizeShow: false,
    fuliList: [{
      url: imgUrl + 'bg1.png'
    }, {
      url: imgUrl+'bg2.png'
    }, {
      url: imgUrl+'bg3.png'
    }, {
      url: imgUrl+'bg4.png'
    }],
    count_down: '',
    endTime: '',
    actEndTimeList: [],
    goodNum: 1
  },
  prevImg: function () {
    var swiper = this.data.swiper
    var noticeList = this.data.noticeList
    var current = swiper.current
    swiper.current = current >= noticeList.length - 1 ? current - 1 : current + 1;
    this.setData({
      swiper: swiper,
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
  // 轮播特效果二
  bindchange(e) {
    this.setData({
      swiperIdx: e.detail.current
    })
  },
  goPage(e) {
    console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index == 0) {
      wx.navigateTo({
        url: '/pages/index/Newcomer/index',
      })
    } else if (e.currentTarget.dataset.index == 1) {
      wx.navigateTo({
        url: '/pages/index/lghd/lghd',
      })
    } else if (e.currentTarget.dataset.index == 2) {
      wx.navigateTo({
        url: '/pages/index/agencyDetail/index',
      })
    }
  },
  // 切换规格
  switch (event) {
    const index = event.currentTarget.dataset.index
    const specificationId = event.currentTarget.dataset.commodityspecificationid
    const price = event.currentTarget.dataset.p
    this.setData({
      currentPrice: price,
      skuIndex: index,
      specificationId: specificationId //规格id
    })
  },
  addNum() {
    this.setData({
      goodNum: this.data.goodNum + 1
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
      // userId: '81'
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
  nextImg: function () {
    console.log(2);
    var swiper = this.data.swiper;
    var current = swiper.current;
    swiper.current = current < (noticeList.length - 1) ? current + 1 : 0;
    this.setData({
      swiper: swiper,
    })
  },
  scrolltxt: function () {
    clearInterval(timer)
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      timer = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin + windowWidth; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        // console.log(crentleft)

        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(timer);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  reduce() {
    const self = this
    timer1 = setInterval(() => {
      let endTime = this.data.endTime
      let diff = endTime - new Date().getTime()
      if (diff <= 0) {
        clearInterval(timer1)
        self.setData({
          diff: false,
          endTime: ''
        })
      }
      self.setData({
        nowTime: new Date().getTime()
      })
    }, 1000);
  },
  // 获取所有区域code
  gitAllareaCode() {
    wx.showLoading({
      title: '加载中...',
    })
    const self = this
    api.getAllArea({
      areaCode: wx.getStorageSync('shortAreaCode')
    }).then(res => {
      console.log(res)
      if (res.status == 200) {
        if (res.data == null) {
          this.setData({
            poster: true
          })
          wx.setStorageSync('poster', true)
          return
        } else {
          this.setData({
            poster: false
          })
          wx.setStorageSync('poster', false)
        }
        wx.setStorageSync('areaCode', res.data)
      }
      self.swiper();
      self.getHome();
    })
  },
  // 公告
  notice() {
    wx.navigateTo({
      url: '/home/notice/index',
    })
  },
  // 查看我的优惠券
  lookCoupon() {
    wx.showLoading({
      title: '',
    })
    api.getVoucherToUser({
      areaCode: wx.getStorageSync('shortAreaCode'),
      // areaCode: '420117',
      userId: wx.getStorageSync("userId"),
      merchantId: wx.getStorageSync('merchantId')
      // userId: '81'
    }).then(res => {
      wx.hideLoading()
      if (res.data.status === 1) {
        this.setData({
          gift: false
        })
        wx.showToast({
          title: '领取成功！',
          icon: "success",
          duration: 2000,
          complete: () => {
            wx.navigateTo({
              url: `/self/yhq/yhq`,
            })
          }
        })
      }
      wx.showToast({
        title: res.data.message,
      })
    })
  },
  benefit() {
    wx.navigateTo({
      url: '/pages/index/lghd/lghd',
    })
  },
  usequan() {
    wx.switchTab({
      url: `/pages/index/index/index`,
    })
  },
  onPullDownRefresh() {
    this.swiper();
    this.getHome();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onHide() {
    clearInterval(timer)
  },
  selectLocation() {
    wx.navigateTo({
      url: '/home/location/index',
    })
  },
  onShow() {
    // this.gitAllareaCode()
    /* this.setData({
        poster : wx.getStorageSync('poster')
    }) */

    const self = this
    // wx.authorize({
    //   scope: 'scope.userLocation',
    //   success() {
    //     // console.log('授权地理位置')
    //     // 授权地理位置
    //     wx.getLocation({
    //       type: 'wgs84',
    //       success(res) {
    //         // console.log(res)
    //         const latitude = res.latitude
    //         const longitude = res.longitude
    //         qqmapsdk.reverseGeocoder({
    //           location: {
    //             latitude,
    //             longitude
    //           },
    //           success: function (res) {
    //             console.log(res)
    //             const result = res.result.ad_info.adcode
    //             wx.setStorageSync('shortAreaCode', result)
    //             self.getmerchantId()
    //             self.setData({
    //               location: res.result.address_component.city + res.result.address_component.district
    //             })
    //             // wx.setStorageSync('areaCode', result)
    //             self.setData({
    //               areaCode: result
    //             })

    //             // self.gitAllareaCode()
    //             wx.setStorageSync('location', self.data.location)

    //             api.isOnLine().then(res => {
    //               if (res.data == 1) {
    //                 api.getDictValue({
    //                   dataType: 'area_code'
    //                 }).then(res => {
    //                   const data = res.data[0]
    //                   // console.log(data)
    //                   self.setData({
    //                     areaCode: data.key,
    //                   })
    //                   wx.setStorageSync('shortAreaCode', data.key)
    //                   wx.setStorageSync('location', data.text)
    //                   // self.gitAllareaCode()
    //                 })
    //               }
    //             })
    //           },
    //           fail: function (error) {
    //             // console.error(error);

    //           },
    //           complete: function (res) {
    //             // console.log(res);
    //           }
    //         })
    //       }
    //     })
    //   },
    //   fail() {
    //     // console.log('fail')

    //     api.getDictValue({
    //       dataType: 'area_code'
    //     }).then(res => {
    //       const data = res.data[0]
    //       // console.log(data)
    //       self.setData({
    //         areaCode: data.key,
    //         location: data.text
    //       })
    //       wx.setStorageSync('shortAreaCode', data.key)
    //       wx.setStorageSync('location', data.text)
    //       // self.gitAllareaCode()
    //     })

    //   }
    // })

  },
  // 关闭红包
  closeCoupon() {
    this.setData({
      modal: false,
      gift: false
    })
  },
  // 获取openid
  getOpenid(code) {
    api.getOpenid({
      code: code
    }).then(res => {
      if (res.status == 200) {
        const data = res.data
        // console.log('openid', data.openid)
        wx.setStorageSync('session_key', data.session_key)
        wx.setStorageSync('openid', data.openid)
      }
    })
  },
  // 登录
  login() {
    const self = this
    api.login({
      openid: wx.getStorageSync('openid'),
      appId: wx.getStorageSync('appId'),
      areaCode: wx.getStorageSync('shortAreaCode')
    }).then(res => {
      // 登录成功 
      if (res.data.status == 1) {
        console.log('登录成功', res)
        wx.setStorageSync('userId', res.data.userId)
        wx.setStorageSync('userName', res.data.userName)
        wx.setStorageSync('headUrl', res.data.headUrl)
        // wx.setStorageSync('agencyId', res.data.agencyId)
        if (res.data.voucherFlag !== 0) {
          this.getYhq()
        }
        this.getHome()
        this.swiper()
      } else if (res.data.status == 0) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        return
      } else {
        wx.showToast({
          title: "用户未注册",
          icon: 'none'
        })
        
        const userId = wx.getStorageSync('userId')
        console.log('获取缓存用户id', userId)
        if (!userId) {
          // 注册流程 微信登录 -> 获取openid -> 获取用户信息 -> 获取手机号 -> 注册
          // wx.login({
          //   success: (res) => {
          //     debugger
          //     // console.log(res.code)
          //     self.getOpenid(res.code)
          //   },
          // })
        console.log('用户未注册')

          this.register()
          this.setData({
            getuserInfo: true,
            modal: true
          })
        }

        // wx.login({
        //   success: (res) => {
        //     // console.log(res.code)
        //     self.getOpenid(res.code)
        //   },
        // })
        this.setData({
          getuserInfo: true,
          modal: true
        })
      }
    })
  },
  // 获取新人优惠券
  getYhq() {
    wx.showLoading({
      title: '',
    })
    api.getVoucherList1({
      useType: 0,
      merchantId: wx.getStorageSync('merchantId')
    }).then(res => {
      wx.hideLoading()
      this.setData({
        gift: true
      })
      // console.log(res)
      const data = res.data
      for (var i=0; i< data.list.length; i++ ) {
        data.list[i].createTime = data.list[i].createTime.split(' ')[0]
      }
      this.setData({
        totalPage: data.totalPage,
        pageNum: data.pageNum,
        couponList: data.list,
        isRequest: false
      })
      wx.hideLoading({})

    })
  },
  // 获取区域id
  getmerchantId() {
    wx.showLoading({
      title: '加载中...',
    })
    api.getAgencyId({
      areaCode: wx.getStorageSync('shortAreaCode'),
      // areaCode: '330703',
      appId: wx.getStorageSync('appId')
    }).then(res => {
      if (res.status == 200) {
        if (res.data) {
          const data = res.data
          // console.log('openid', data.openid)
          wx.setStorageSync('agencyId', data.agencyId)
          wx.setStorageSync('merchantId', data.merchantId)
        } else {
          // wx.setStorageSync('agencyId', 31)
          // wx.setStorageSync('merchantId', 155) 
          wx.hideLoading()
          this.setData({
            poster: true
          })
          return false
        }
        this.getHome()
        this.swiper()
        this.getList()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.msg
        })
        this.setData({
          poster: true
        })
      }
    })
  },
  // 拒绝
  reject() {
    this.setData({
      getuserInfo: false,
      modal: false
    })
  },
  // 获取用户手机号
  getUserPhone() {
    api.getUserPhone({
      encryptDataB64: this.data.encryptedData,
      ivB64: this.data.iv,
      sessionKeyB64: wx.getStorageSync('session_key')
    }).then(res => {
      // console.log(res)
      const data = res.data
      if (res.status == 200) {
        this.checkPhone()
        // wx.setStorageSync('phone', JSON.parse(data).phoneNumber)
        this.setData({
          phone: JSON.parse(data).phoneNumber
        })
      }
      // this.register()
    })
  },
  // 验证手机号
  checkPhone () {
    wx.showLoading({
      title: '',
    })
    api.checkPhone({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      wx.hideLoading()
      console.log(res)
    })
  },
  // 注册
  register() {
    console.log(1212122)
    api.register({
      areaCode: wx.getStorageSync("shortAreaCode"),
      openid: wx.getStorageSync('openid'),
      appId: wx.getStorageSync('appId'),
      userName: this.data.userName,
      headUrl: this.data.headUrl,
      // userPhone: this.data.phone,
      inviterId: this.data.inviterId
    }).then(res => {
      console.log(res)
      if (res.status = 1) {
        const data = res.data
        wx.setStorageSync('userId', data.userId)
        if (data.list.length > 0) {
          this.setData({
            voucher: data.list[0],
            gift: true,
            modal: true
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
    })
  },
  onLoad: function (query) {
    if (query) {
      // 生成二维码时传入的scene
      const scene = decodeURIComponent(query.scene)
      // console.log(scene)
      if (scene != "undefined") {
        this.setData({
          inviterId: scene
        })
      }
    }
    this.setData({
      baseURL,
      imgBaseUrl,
      imgUrl,
      nowTime: new Date().getTime()
    })
    const self = this
    let areaCode = wx.getStorageSync('areaCode')
    this.setData({
      location: wx.getStorageSync('location')
    })
    debugger
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // console.log('授权地理位置')
              // 授权地理位置
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  // console.log(res)
                  const latitude = res.latitude
                  const longitude = res.longitude
                  qqmapsdk.reverseGeocoder({
                    location: {
                      latitude,
                      longitude
                    },
                    success: function (res) {
                      // console.log(res)
                      const result = res.result.ad_info.adcode
                      wx.setStorageSync('shortAreaCode', result)
                      self.getmerchantId()
                      self.setData({
                        location: res.result.address_component.city + res.result.address_component.district
                      })
                      // wx.setStorageSync('areaCode', result)
                      self.setData({
                        areaCode: result
                      })

                      // self.gitAllareaCode()
                      wx.setStorageSync('location', self.data.location)
                    },
                    fail: function (error) {
                      // console.error(error);
                    },
                    complete: function (res) {
                      // console.log(res);
                    }
                  })
                }
              })
            },
            fail() {
              // console.log('fail')

              api.getDictValue({
                dataType: 'area_code'
              }).then(res => {
                const data = res.data[0]
                // console.log(data)
                self.setData({
                  areaCode: data.key,
                  location: data.text
                })
                wx.setStorageSync('shortAreaCode', data.key)
                wx.setStorageSync('location', data.text)
                // self.gitAllareaCode()
              })

            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              // console.log(res)
              const latitude = res.latitude
              const longitude = res.longitude
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude,
                  longitude
                },
                success: function (res) {
                  // console.log(res)
                  const result = res.result.ad_info.adcode
                  wx.setStorageSync('shortAreaCode', result)
                  self.getmerchantId()
                  self.setData({
                    location: res.result.address_component.city + res.result.address_component.district
                  })
                  // wx.setStorageSync('areaCode', result)
                  self.setData({
                    areaCode: result
                  })

                  // self.gitAllareaCode()
                  wx.setStorageSync('location', self.data.location)
                },
                fail: function (error) {
                  // console.error(error);
                },
                complete: function (res) {
                  // console.log(res);
                }
              })
            }
          })
        }
      }
    })
    
    wx.login({
      success: (res) => {
        let code = res.code
        api.getOpenid({
          code,
          appId: wx.getStorageSync('appId')
        }).then(res => {
          if (res.status == 200) {
            const data = res.data
            if (data.errcode == -1){
              wx.showToast({
                title: '系统繁忙,请稍后再试',
                icon: 'none'
              })
              return false
            } else if (data.errcode == 40029) {
              wx.showToast({
                title: 'code 无效',
                icon: 'none'
              })
              return false
            } else if (data.errcode == 45011) {
              wx.showToast({
                title: '操作太频繁了，请稍后再试',
                icon: 'none'
              })
              return false
            } else {
              wx.setStorageSync('session_key', data.session_key)
              wx.setStorageSync('openid', data.openid)
            }
            // console.log('openid', data.openid)
            
          }
          self.login()
        })
      },
    })
  },
  onHide: function () {
    timer && clearInterval(timer) //清楚定时器 防止内存泄漏
    timer1 && clearInterval(timer1) //清楚定时器 防止内存泄漏
  },
  // 设置时间
  date_format: function (endTime) {
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endTime = new Date(endTime).getTime(); //结束时间（时间戳）
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
  // 位数不足补零
  fill_zero_prefix: function (num) {
    num = num < 0 ? 0 : num; //防止出现负数
    return num < 10 ? "0" + num : num //补零操作
  },
  toSearch() {
    wx.navigateTo({
      url: '/home/search/index/index',
    });
  },
  goCg(e) {
    const id = e.currentTarget.dataset.classid || 0
    const index = app.getValue(e).index
    wx.navigateTo({
      url: `/pages/index/cg/cg?classId=${id}&index=${index}`
    })
  },
  goList(e) {
    const type = app.getValue(e).type
    let seckillId
    if (app.getValue(e).id) {
      seckillId = app.getValue(e).id
    }
    wx.navigateTo({
      url: `/pages/index/goodsList/cg?type=${type}&seckillId=${seckillId}`
    })
    // wx.navigateTo({
    //   url: '/pages/location/index',
    // })
  },
  goPt() {
    wx.navigateTo({
      url: '/pages/index/pt/pt'
    })
  },
  goMs() {
    wx.navigateTo({
      url: '/pages/index/ms/ms'
    })
  },
  goQc() {
    wx.navigateTo({
      url: '/pages/index/qc/qc'
    })
  },
  goShlm(e) {
    const index = app.getValue(e).id || 0
    wx.navigateTo({
      url: `/pages/index/shlm/shlm?index=${index}`
    })
  },
  // 获取手机
  getPhoneNumber(e) {
    const res = e.detail
    if (res.errMsg == "getPhoneNumber:ok") {
      this.setData({
        iv: res.iv,
        encryptedData: res.encryptedData
      })
      this.getUserPhone()
    }
    this.closeModal()
  },
  closeLoading() {
    wx.hideLoading()
  },
  // 获取用户信息
  bindGetUserInfo(e) {
    const self = this
    const userInfo = e.detail.userInfo;
    wx.showLoading({
      title: '正在授权...',
    })
    this.setData({
      getuserInfo: false,
      userName: userInfo.nickName
    })

    wx.getImageInfo({
      src: userInfo.avatarUrl,
      success(res) {
        // console.log(res.path)
        wx.uploadFile({
          filePath: res.path,
          name: 'file',
          url: baseURL + 'api/common/ImgUpload',
          success(res) {
            wx.hideLoading()
            // console.log(res.data)
            const result = JSON.parse(res.data)
            self.setData({
              headUrl: result.data.filePath,
              modal: false
            })
            self.register()
          }
        })
      }
    })
    // console.log(e.detail.userInfo)
  },
  // 关闭弹框
  closeModal() {
    this.setData({
      show: false,
      modal: false
    })
  },
  // 首页轮播图
  swiper() {
    api.getSwiper({
      merchantId: wx.getStorageSync('merchantId'),
      site: 0
    }).then(res => {
      if (res.status == 200) {
        let arr = res.data
        this.setData({
          imgArr: arr
        })
      }
    })
  },
  // 点击轮播图 进入
  handleTap(e) {
    wx.openLocation({
      latitude: Number(this.data.merchantDetail.lat),	//维度
      longitude: Number(this.data.merchantDetail.lng), //经度
      name: this.data.merchantDetail.merchantName,	//目的地定位名称
      scale: 15,	//缩放比例
      address: this.data.merchantDetail.merchantAddress	//导航详细地址
    })
  },
  addCar(e) {
    this.checkUser()
    this.setData({
      id: e.currentTarget.dataset.data.outId,
      detail: e.currentTarget.dataset.data
    })
    this.specification()
    this.setData({
      goodSizeShow: true
    })
  },
  checkUser() {
    app.checkUser()
  },

  close_goodSizeShow() {
    this.setData({
      goodSizeShow: false
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
  // 商品详情
  goodDetail(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type //0：限时秒杀；1：拼团；2：清仓
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/home/goodsDe/index?id=${id}&type=${type}`,
    })
  },
  // 一级分类
  getList(item) {
    wx.navigateTo({
      url: `/pages/sort/index?type=${item}`,
    })
    api.getAllClass({
      agencyId: wx.getStorageSync('agencyId')
    }).then(res => {
      console.log(res.data)
      // this.setData({
      //   list: res.data,
      //   // classId: res.data[0].classId
      // })
    })
  },
  // 首页信息
  getHome() {
    wx.showLoading({
      title: '加载中...',
    })
    clearInterval(timer)
    var that = this;
    api.home({
      merchantId: wx.getStorageSync('merchantId'),
      agencyId: wx.getStorageSync('agencyId')
    }).then(res => {
      const data = res.data
      const notice = data.content
      // console.log(data)
      const num = Math.ceil(data.classList.length / 10)
      const num1 = Math.ceil(data.clearanceSaleList.length / 3)
      const classList1 = []
      const classList2 = []
      for (var i = 0; i < num; i++) {
        var ar = [];
        for (var j = (i *10); j < 10 * (i+1); j++) {
          if (j < data.classList.length) {
            ar.push(data.classList[j])
          }
        }
        classList1.push(ar)
      }
      for (var i = 0; i < num1; i++) {
        var ar = [];
        for (var j = (0 * 3); j < 3 * (i + 1); j++) {
          if (j < data.clearanceSaleList.length) {
            ar.push(data.clearanceSaleList[j])
          }
        }
        classList2.push(ar)
      }
      console.log(classList2)
      this.setData({
        lifelList: data.lifelList,
        groupBookingList: data.groupBookingList,
        seckillList: data.seckill,
        newCommodityList: data.newCommodityList,
        noticeList: data.noticeList,
        classList: classList1,
        hotCommodityList: data.hotCommodityList,
        clearanceSaleList: classList2,
        merchantDetail: data.merchantDetail,
        messageStatus: data.messageStatus,
        endTime: data.seckill.endTime
      })
      wx.hideLoading()
      timer = setInterval(() => {
        that.date_format(that.data.endTime)
      }, 1000)
      const endTimeList = []

      for (var i = 0; i < that.data.groupBookingList.length; i++) {
        var objs = {};
        objs.eTime = that.data.groupBookingList[i].endTime
        endTimeList.push(objs)
      }
      this.setData({
        actEndTimeList: endTimeList
      });
      this.countDown();
      that.reduce()
      notice && this.setData({
        notice
      })

      try {
        if (notice) {
          var length = that.data.notice.length * that.data.size / 2 + 100; //文字长度
          var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
          that.setData({
            length: length,
            windowWidth: windowWidth
          });
          that.scrolltxt(); // 第一个字消失后立即从右边出现
        }
      } catch (error) {
        console.log(error)
      }
    })
  },
  // 时间差比较
  shijiancha(faultDate, completeTime) {

    var stime = Date.parse(new Date(faultDate));

    var etime = Date.parse(new Date(completeTime));

    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    var time = formatTimes(usedTime)
    return time;

  },
  // 家装拼团
  booking(e) {
    const id = e.currentTarget.dataset.id
    // console.log("拼团id", id)
    wx.navigateTo({
      url: `/home/ptDe/index?id=${id}`,
    })
  },
  // 全部商家
  shops() {
    wx.navigateTo({
      url: '/pages/index/shops1/shop',
    })
  },
  // 秒杀
  ms(e) {
    const id = e.currentTarget.dataset.id
    // console.log("秒杀id", id)
    wx.navigateTo({
      url: `/home/msDe/index?id=${id}`,
    })
  },
  // 清仓
  clear(e) {
    const id = e.currentTarget.dataset.id
    // console.log("清仓id", id)
    wx.navigateTo({
      url: `/home/qcDe/index?id=${id}`,
    })
  },
  // 店铺拨打电话
  freeTell () {
    wx.makePhoneCall({
      phoneNumber: this.data.merchantDetail.merchantTel,
    })

  },
  // 回到顶部
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 去购物车
  toCar () {
    app.checkUser()
    wx.navigateTo({
      url: '/home/buyCar/index/car',
    })
  }
})