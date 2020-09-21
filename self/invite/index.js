// pages/self/invite/index.js
import api from "../../utils/api"
import {
    baseURL,
    imgBaseUrl
} from "../../utils/http"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    copy() {
        wx.getImageInfo({
            src: this.data.imgBaseUrl + this.data.url,
            success(res) {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(res) {
                        console.log(res)
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                        })
                    }
                })
            }
        })
    },
    /* copy() {
      const filePath = wx.env.USER_DATA_PATH + '/invite.png'
      const arrayBuffer = wx.base64ToArrayBuffer(this.data.url)
      const fs = wx.getFileSystemManager()
      fs.writeFile({
        filePath: filePath,
        data: arrayBuffer,
        encoding: 'base64',
        success(res) {
          console.log(res)
          wx.saveImageToPhotosAlbum({
            filePath,
            success(res) {
              console.log(res)
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            }
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    }, */
    getList() {
        api.inviterList({
            pageNum: 1,
            pageSize: 20
        }).then(res => {
            const data = res.data
            this.setData({
                list: data.list,
            })
        })
    },
    goList() {
        wx.navigateTo({
            url: '/pages/self/invite/list/index',
        })
    },
    getToken() {
        const self = this
        api.getWXToken({

        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                wx.request({
                    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
                    method: 'POST',
                    data: {
                        "scene": wx.getStorageSync('userId'),
                        "is_hyaline": true
                    },
                    responseType: 'arraybuffer',
                    success(res) {
                        self.setData({
                            url: wx.arrayBufferToBase64(res.data)
                        })
                        // console.log(self.data.url)
                    }
                })

            }
        })
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
        this.getList()
        // this.getToken()
        api.getinviteCode({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            console.log(res.data)

            if (res.status == 200) {
                // let base64 = wx.arrayBufferToBase64(res.data)
                this.setData({
                    url: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})