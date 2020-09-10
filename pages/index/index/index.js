//index.js
//获取应用实例
import api from "../../../utils/api.js"
import {
  baseURL,
  imgBaseUrl
} from "../../../utils/http.js"

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
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0
    }
  },
  prevImg: function () {
    var swiper = this.data.swiper
    var noticeList = this.data.noticeList
    var current = swiper.current
    swiper.current = current > 0 ? current - 1 : noticeList.length - 1;
    this.setData({
      swiper: swiper,
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
  scrolltxt: function() {
    clearInterval(timer)
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      timer = setInterval(function() {
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
      url: '/pages/notice/index',
    })
  },
  // 查看我的优惠券
  lookCoupon() {
    wx.navigateTo({
      url: '/pages/self/yhq/yhq'
    })
  },
  benefit() {
    wx.navigateTo({
      url: '/pages/index/lghd/lghd',
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
      url: '/pages/location/index',
    })
  },
  onShow() {
    // this.gitAllareaCode()
    /* this.setData({
        poster : wx.getStorageSync('poster')
    }) */

    const self = this
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
              success: function(res) {
                console.log(res)
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

                self.gitAllareaCode()
                wx.setStorageSync('location', self.data.location)

                api.isOnLine().then(res => {
                  if (res.data == 1) {
                    api.getDictValue({
                      dataType: 'area_code'
                    }).then(res => {
                      const data = res.data[0]
                      // console.log(data)
                      self.setData({
                        areaCode: data.key,
                      })
                      wx.setStorageSync('shortAreaCode', data.key)
                      wx.setStorageSync('location', data.text)
                      self.gitAllareaCode()
                    })
                  }
                })
              },
              fail: function(error) {
                // console.error(error);

              },
              complete: function(res) {
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
          self.gitAllareaCode()
        })

      }
    })

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
      openid: wx.getStorageSync('openid')
    }).then(res => {
      // 登录成功 
      if (res.data.status == 1) {
        // console.log('登录成功')
        wx.setStorageSync('userId', res.data.userId)
        console.log('userId', res.data.userId)
      } else if (res.data.status == 0) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        return
      } else {
        const userId = wx.getStorageSync('userId')
        console.log('获取缓存用户id', userId)
        if (!userId) {
          // 注册流程 微信登录 -> 获取openid -> 获取用户信息 -> 获取手机号 -> 注册
          wx.login({
            success: (res) => {
              // console.log(res.code)
              self.getOpenid(res.code)
            },
          })
          this.setData({
            getuserInfo: true,
            modal: true
          })
        }

        wx.login({
          success: (res) => {
            // console.log(res.code)
            self.getOpenid(res.code)
          },
        })
        this.setData({
          getuserInfo: true,
          modal: true
        })
      }
    })
  },
  // 获取区域id
  getmerchantId() {
    api.getAgencyId({
      // areaCode: getStorageSync('shortAreaCode'),
      areaCode: '420117',
      appId: wx.getStorageSync('appId')
    }).then(res => {
      if (res.status == 200) {
        if (res.data) {
          const data = res.data
          // console.log('openid', data.openid)
          wx.setStorageSync('agencyId', data.agencyId)
          wx.setStorageSync('merchantId', data.merchantId)
        } else {
          wx.setStorageSync('agencyId', 31)
          wx.setStorageSync('merchantId', 155)
        }

        this.getHome()
        this.getSwiper()
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
        this.setData({
          phone: JSON.parse(data).phoneNumber
        })
      }
      this.register()
    })
  },
  // 注册
  register() {
    api.register({
      areaCode: wx.getStorageSync("areaCode"),
      openid: wx.getStorageSync('openid'),
      userName: this.data.userName,
      headUrl: this.data.headUrl,
      // userPhone: this.data.phone,
      inviterId: this.data.inviterId
    }).then(res => {
      console.log(res)
      if (res.data.status = 1) {
        const data = res.data
        wx.setStorageSync('userId', data.userId)
        if (data.list.length > 0) {
          this.setData({
            voucher: data.list[0],
            gift: true,
            modal: true
          })
        }
      }
    })
  },
  onLoad: function(query) {
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
      nowTime: new Date().getTime()
    })
    const self = this
    let areaCode = wx.getStorageSync('areaCode')
    this.setData({
      location: wx.getStorageSync('location')
    })
    if (!areaCode) {
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
                      success: function(res) {
                        // console.log(res)
                        const result = res.result.ad_info.adcode
                        wx.setStorageSync('shortAreaCode', result)

                        self.setData({
                          location: res.result.address_component.city + res.result.address_component.district
                        })
                        // wx.setStorageSync('areaCode', result)
                        self.setData({
                          areaCode: result
                        })

                        self.gitAllareaCode()
                        wx.setStorageSync('location', self.data.location)
                      },
                      fail: function(error) {
                        // console.error(error);
                      },
                      complete: function(res) {
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
                  self.gitAllareaCode()
                })

              }
            })
          }
        }
      })
    } else {
      this.getmerchantId()
    }

    wx.login({
      success: (res) => {
        let code = res.code
        api.getOpenid({
          code,
        }).then(res => {
          if (res.status == 200) {
            const data = res.data
            // console.log('openid', data.openid)
            wx.setStorageSync('session_key', data.session_key)
            wx.setStorageSync('openid', data.openid)
          }
          self.login()
        })
      },
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '../../search/index/index',
    });
  },
  goCg(e) {
    const index = app.getValue(e).id || 0
    console.log(index)
    wx.navigateTo({
      url: `../../index/cg/cg?index=${index}`
    })
  },
  gojz(e) {
    const index = app.getValue(e).id || 0
    wx.navigateTo({
      url: `../../index/jz/cg?index=${index}`
    })
  },
  goPt() {
    wx.navigateTo({
      url: '../../index/pt/pt'
    })
  },
  goMs() {
    wx.navigateTo({
      url: '../../index/ms/ms'
    })
  },
  goQc() {
    wx.navigateTo({
      url: '../../index/qc/qc'
    })
  },
  goShlm(e) {
    const index = app.getValue(e).id || 0
    wx.navigateTo({
      url: `../../index/shlm/shlm?index=${index}`
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
        let arr = res.data.carouselList
        this.setData({
          imgArr: arr
        })
      }
    })
  },
  // 点击轮播图 进入店铺
  handleTap(e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: `/pages/store/store?id=${id}`,
      })
    }
  },
  // 商品详情
  goodDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goodsDe/index?id=${id}`,
    })
  },
  // 首页信息
  getHome() {
    clearInterval(timer)
    var that = this;
    api.home({
      merchantId: wx.getStorageSync('merchantId'),
      agencyId: wx.getStorageSync('agencyId')
    }).then(res => {
      const data = res.data
      const notice = data.content
      // console.log(data)

      this.setData({
        endTime: data.endTime,
        buildinglList: data.buildinglList,
        decorationlList: data.decorationlList,
        lifelList: data.lifelList,
        carouselList: data.carouselList,
        groupBookingList: data.groupBookingList,
        seckillList: data.seckillList,
        clearanceSaleList: data.clearanceSaleList,
        merchantList: data.merchantList,
        noticeList: data.noticeList
      })
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
  // 家装拼团
  booking(e) {
    const id = e.currentTarget.dataset.id
    // console.log("拼团id", id)
    wx.navigateTo({
      url: `/pages/ptDe/index?id=${id}`,
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
      url: `/pages/msDe/index?id=${id}`,
    })
  },
  // 清仓
  clear(e) {
    const id = e.currentTarget.dataset.id
    // console.log("清仓id", id)
    wx.navigateTo({
      url: `/pages/qcDe/index?id=${id}`,
    })
  },
  // 回到顶部
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
})