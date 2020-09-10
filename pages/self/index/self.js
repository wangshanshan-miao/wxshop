// pages/self/self.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    appId
} from "../../../utils/http"
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
            modal: false
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
        const self = this
        api.login({
            openId: wx.getStorageSync('openid')
        }).then(res => {
            console.log(res)
            if (res.data.status == 1) {
                wx.showToast({
                  title: '登录成功',
                  icon : 'none'
                })
                const userId = res.data.userId
                wx.setStorageSync('userId', userId)
                self.userInfo()
            }else if (res.data.status == 0) {
                wx.showToast({
                  title: res.data.message,
                  icon:"none"
                })
                return 
            }else{
                self.setData({
                    modal: true,
                    getuserInfo: true,
                })
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
        this.userInfo()
    },
    // 我的收获地址
    address() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '/pages/self/address/index',
            })
        }        
    },
    // 商家入住
    join() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '/pages/self/join/index',
            })
        }
    },
    // 商务合作申请
    cooperation() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '/pages/self/cooperation/index',
            })
        }
    },
    // 邀请好友
    invite() {
        
        if (app.checkUser()) {
            wx.navigateTo({
                url: '/pages/self/invite/index',
            })
        }
        
    },
    // 普通订单详情
    normalOrder(e) {
        if (app.checkUser()) {
            
            const index = app.getValue(e).index
            const status = app.getValue(e).status
            console.log(index)
            wx.navigateTo({
                url: `/pages/self/ptorder/index?index=${index}&status=${status}`,
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
                url: `/pages/self/clorder/index?index=${index}&status=${status}`,
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
                url: '../basic/basic',
            });
        }
    },
    goYj() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '../yj/yj',
                
            });
        }
    },
    goYhq() {
        if (app.checkUser()) {
            
            wx.navigateTo({
                url: '../yhq/yhq',
                
            });
        }
    },
    goSc() {
        if (app.checkUser()) {
            wx.navigateTo({
                url: '../sc/sc',
                
            });
        }
    },
    goAllOrder() {
        if (app.checkUser()) {
            
            if (this.data.userOrderTab == 0) {
                wx.navigateTo({
                    url: '../ptorder/index'
                });
            } else {
                wx.navigateTo({
                    url: '../clorder/index'
                });
            }
        }

    }

})