//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {

    },
    checkUser() {
        const userId = wx.getStorageSync('userId')
        if (!userId) {
            wx.showToast({
                title: '请登录！',
                icon: "none",
                duration : 2000,
                complete: () => {}
            })
           return false
        }else{
            return true
        }
    },
    getValue: function (e) {
        return e.currentTarget.dataset
    },
    statusJudge(i) {
        switch (i) {
            case 1:
                return 0
                break;
            case 2:
                return 11
                break;
            case 3:
                return 1
                break;
            case 4:
                return 4
                break;
            case 5:
                return 7
                break;
            case 5:
                return 8
                break;
            default:
                return null
                break;
        }
    },
    statusJudge1(i) {
        switch (i) {
            case 1:
                return 5
                break;
            case 2:
                return 6
                break;
            case 3:
                return 8
                break;
            default:
                return null
                break;
        }
    },
})