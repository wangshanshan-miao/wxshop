// pages/self/self.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl,
    appId
} from "../../utils/http"
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
      userOrderTab: 0,
      userInfo: {},
      modal: false,
      getuserInfo: false,
      show: false,
      gift: false,
      showPhone: false
    },
    // 关闭红包
    closeCoupon() {
        this.setData({
            modal: false,
            gift: false
        })
    },
    // 拒绝
    reject() {
        this.setData({
            getuserInfo: false,
            modal: false
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
            areaCode: wx.getStorageSync('areaCode'),
            openid: wx.getStorageSync('openid'),
            userName: this.data.userName,
            headUrl: this.data.headUrl,
            // userPhone: this.data.phone,
            inviterId: this.data.inviterId // 邀请人id
        }).then(res => {
            // console.log(res)
            if (res.data.status = 1) {
                const data = res.data
                wx.setStorageSync('userId', data.userId)
                this.userInfo()
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
    // 获取手机
    getPhoneNumber(e) {
        const res = e.detail
        console.log(e)
        if (res.errMsg == "getPhoneNumber:ok") {
            this.setData({
                iv: res.iv,
                encryptedData: res.encryptedData
            })
            this.getUserPhone()
        }
        this.closeModal()
    },
    // 留言板
    comment () {
      wx.navigateTo({
        url: `/self/msg/msg`,
      })
    },

    // 购物车
    car () {
      wx.navigateTo({
        url: '/home/buyCar/index/car',
      })
    },
    // 获取用户信息
    bindGetUserInfo(e) {
        const self = this
        const userInfo = e.detail.userInfo;
        this.setData({
            userName: userInfo.nickName
        })
        wx.showLoading({
            title: '授权中...',
        })
        this.setData({
            getuserInfo: false,
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
                        // console.log(res.data)
                        wx.hideLoading()
                        const result = JSON.parse(res.data)
                        self.setData({
                            headUrl: result.data.filePath,
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
            modal: false,
            showPhone: false
        })
    },
    // 用户信息
    userInfo() {
        api.selectUserDetail({
            userId: wx.getStorageSync('userId')
        }).then(res => {
          console.log('res',res);
          wx.setStorageSync('userName', res.data.userName);
            wx.setStorageSync('userHead', imgBaseUrl+res.data.headUrl);
            this.setData({
                userInfo: res.data
            })
        })
    },
    // 登录弹框
    login1() {
        const self = this
        wx.login({
          success: (res) => {
            api.getOpenid({
              code: res.code,
              appId: appId
              }).then(res=>{
                  if(res.status == 200){
                    //wx.setStorageSync('openid', 'res.data.openid')
                    wx.setStorageSync('openid', 'abc123456')
                    self.login()
                  }
              })
          },
        })
    },
    login() {
      debugger
      const self = this
      api.login({
        openid: wx.getStorageSync('openid'),
        appId: wx.getStorageSync('appId'),
        areaCode: wx.getStorageSync('shortAreaCode')
      }).then(res => {
        // 登录成功 
        if (res.data.status == 1) {
          // console.log('登录成功')
          wx.setStorageSync('userId', res.data.userId)
          wx.setStorageSync('userName', res.data.userName)
          wx.setStorageSync('headUrl', res.data.headUrl)
          wx.setStorageSync('agencyId', res.data.agencyId)
          console.log('userId', res.data.userId)
        } else if (res.data.status == 0) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          return
        } else {
          // 获取用户信息
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    debugger
                    // 可以将 res 发送给后台解码出 unionId
                    this.globalData.userInfo = res.userInfo

                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                    this.register()
                  }

                })
              }
            }
          })
          // wx.showToast({
          //   title: "用户未注册",
          //   icon: 'none'
          // })
          // const userId = wx.getStorageSync('userId')
          // console.log('获取缓存用户id', userId)
          // if (!userId) {
          // 注册流程 微信登录 -> 获取openid -> 获取用户信息 -> 获取手机号 -> 注册
          // wx.login({
          //   success: (res) => {
          //     debugger
          //     // console.log(res.code)
          //     self.getOpenid(res.code)
          //   },
          // })

          //   this.setData({
          //     getuserInfo: true,
          //     modal: true
          //   })
          // }

          // wx.login({
          //   success: (res) => {
          //     // console.log(res.code)
          //     self.getOpenid(res.code)
          //   },
          // })
          // this.setData({
          //   getuserInfo: true,
          //   modal: true
          // })
        }
      })
    },
  // 注册
  register() {
    api.register({
      areaCode: wx.getStorageSync("areaCode"),
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
    // 退出登录
    loginOut() {
        wx.removeStorageSync('userId')
        this.setData({
            userInfo: null
        })
        
        this.userInfo()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            baseURL,
            imgBaseUrl,
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
        this.userInfo()
    },
    // 联系我们
    contact () {
      this.setData({
        showPhone: true
      })
    },
    call () {
      wx.makePhoneCall({
        phoneNumber: '400-888-8090',
      })
    },
    // 我的收获地址
    address() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '/self/address/index',
            })
        }        
    },
    // 商家入住
    join() {
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/join/index',
            })
        }
    },
    // 商务合作申请
    cooperation() {
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/cooperation/index',
            })
        }
    },
    // 邀请好友
    invite() {
        
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/invite/index',
            })
        }
        
    },
    // 拼团订单详情
    normalOrder(e) {
        if (app.checkUser()) {
          const index = app.getValue(e).index
          const status = app.getValue(e).status
            wx.navigateTo({
              url: `/self/ptorder/index?index=${index}&status=${status}`,
            })
        }
    },
    // 普通订单详情
    allOrder(e) {
      if (app.checkUser()) {
        const index = app.getValue(e).index
        const status = app.getValue(e).status
        wx.navigateTo({
          url: `/self/allorder/index?index=${index}&status=${status}`,
        })
      }
    },
    // 测量订单详情
    measureOrder(e) {
        if (app.checkUser()) { 
            const index = app.getValue(e).index
            const status = app.getValue(e).status
            // console.log(index)
            wx.navigateTo({
              url: `/self/clorder/index?index=${index}&status=${status}`,
            })
        }
    },
    choseTab(e) {
        this.setData({
            userOrderTab: app.getValue(e).index
        })
    },
    goBasic() {
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/basic/basic',
            });
        }
    },
    goYj() {
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/yj/yj',
                
            });
        }
    },
    goYhq() {
      if (app.checkUser()) {
        wx.navigateTo({
          url: `/self/yhq/yhq`,
            
        });
      }
    },
    goDjq(e) {
      if (app.checkUser()) {
        wx.navigateTo({
          url: `/self/djq/djq`,

        });
      }
    },
    goSc() {
        if (app.checkUser()) {
            wx.navigateTo({
              url: '/self/sc/sc',
                
            });
        }
    },
    goAllOrder() {
        if (app.checkUser()) {
            if (this.data.userOrderTab == 0) {
                wx.navigateTo({
                  url: '/self/allorder/index'
                });
            } else {
                wx.navigateTo({
                  url: '/self/clorder/index'
                });
            }
        }

    }

})