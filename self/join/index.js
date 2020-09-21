// pages/self/join/index.js
import api from "../../utils/api.js"
import {
    baseURL,
    imgBaseUrl
} from "../../utils/http.js"

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    merchantType :'',
    codeName: null,
    region: [],
    logoUrl: "",
    sceneryUrl: "",
    realisticPicture: [],
    category: ['家装', '建材', '生活']
  },
  inputName(e) {
    this.setData({
      merchantName: e.detail.value.trim()
    })
  },
  // 手机号格式验证
  checkPhone(e) {
    // let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    // if (reg.test(e.detail.value)) {
      this.setData({
        phone: e.detail.value
      })
    // } else {
    //   this.setData({
    //     phone: ''
    //   })
    // }
  },
  inputMananger(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },
  /* inputTel(e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  }, */
  inputAddress(e) {
    this.setData({
      merchantAddress: e.detail.value.trim()
    })
  },
  inputMerchantTel(e) {
    this.setData({
      merchantTel: e.detail.value.trim()
    })
  },
  checkEmail(e) {
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (reg.test(e.detail.value)) {
      this.setData({
        email: e.detail.value
      })
    } else {
      this.setData({
        email: ''
      })
    }
  },
  inputIntro(e) {
    this.setData({
      merchantIntro: e.detail.value.trim()
    })
  },
  // 选择商户类型
  selectCategory(e) {
    // console.log(e)
    let merchantType = e.detail.value
    this.setData({
      merchantType
    })
  },
  // 选择区域
  selectArea(e) {
    // console.log(e)
    let code = e.detail.code.pop()
    let arr = e.detail.value
    this.setData({
      region: e.detail.value,
      codeName: code,
      areaName : arr.join("")
    })
  },
  // 上传实景图片
  uploadPicture() {
    const self = this
    /* const amount = this.data.realisticPicture.length
    console.log(amount) */
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        self.setData({
          realisticPicture : []
        })
        // console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        let arr = res.tempFilePaths
        // console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          wx.uploadFile({
            url: baseURL + 'api/common/ImgUpload',
            filePath: arr[i],
            name: 'file',
            success(res) {
              if (i == arr.length - 1) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'none'
                })
              }
              const result = JSON.parse(res.data).data.filePath
              let pictureArr = self.data.realisticPicture
              // console.log(result)
              self.setData({
                picture: result,
                realisticPicture: [...pictureArr, result]
              })
            }
          })
        }
      }
    })
  },
  // 上传图片
  upload(e) {
    const type = app.getValue(e).type
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths[0])
        wx.uploadFile({
          url: baseURL + 'api/common/ImgUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
            const result = JSON.parse(res.data).data.filePath
            if (type == 0) {
              self.setData({
                logoUrl: result
              })
            } else {
              self.setData({
                licenseUrl: result
              })
            }
          }
        })
      }
    })
  },
  // 商家申请入驻
  applyMerchant() {
    const merchantName = this.data.merchantName
    const codeName = this.data.areaName // 区域名称
    const merchantAddress = this.data.merchantAddress
    const merchantType = this.data.merchantType.toString()
    const realisticPicture = this.data.realisticPicture.join(",")
    const name = this.data.name
    const phone = this.data.phone
    const email = this.data.email
    const logoUrl = this.data.logoUrl
    const licenseUrl = this.data.licenseUrl
    const merchantIntro = this.data.merchantIntro
    if (!(merchantName && codeName && merchantAddress && merchantType && realisticPicture && name && logoUrl && licenseUrl && merchantIntro)) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return false
    }
    api.applyMerchant({
      userId: wx.getStorageSync('userId'),
      merchantName,
      codeName,
      areaCode: this.data.codeName,
      merchantAddress,
      merchantType,
      realisticPicture,
      name,
      phone,
      email,
      logoUrl,
      licenseUrl,
      merchantIntro,
    }).then(res => {
      console.log(res)
      if (res.data == 1) {
        wx.showToast({
          title: '入驻成功,等待平台审核',
          icon: 'none'
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/self/index/self',
          })
        },1000)
      }
    })
  },
  // 获取区域代理电话
  Phone() {
    api.getPhone({
      areaCode: wx.getStorageSync('shortAreaCode')
    }).then(res => {
      console.log(res)
      this.setData({
        areaPhone: res.data
      })
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
    
    this.Phone()
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