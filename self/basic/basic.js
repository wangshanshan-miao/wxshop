// pages/self/basic/basic.js
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
        url: ''
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
    // 基本信息
    userInfo() {
        api.userBaseInfo({
            userId: wx.getStorageSync('userId')
        }).then(res => {
            // console.log(res)
            let str = res.data.userPhone;
            if (str) {
                /* let reg = /^(\d{3})\d+(\d{4})$/;
                let newStr = str.replace(reg, '$1****$2'); */
                this.setData({
                    phone: str
                })
            }
            this.setData({
                userInfo: res.data
            })
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
        app.checkUser()
        this.userInfo()
    },
    editName() {
        wx.navigateTo({
            url: '../editName/index?name='+this.data.userInfo.userName,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });

    },
    cahngeHead() {
        const self = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: baseURL + 'api/common/ImgUpload',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success(res) {
                        const result = JSON.parse(res.data).data.filePath
                        console.log(result)
                        self.setData({
                            url: result
                        })
                        self.update()
                    }
                })
            }
        })
    },
    update() {
        api.updateUserDetail({
            headUrl: this.data.url,
            userId: wx.getStorageSync('userId')
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
            }
            this.userInfo()
        })
    }
})