Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    }
  },
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false
  },
  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },
    handleClose() {
      this.setData({
        visible: false
      })
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData')
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      this.setData({
        imgDraw: {
          width: '750rpx',
          height: '1134rpx',
          background: 'https://www.deejv.com/unite/image/poster.png',
          views: [
            {
              type: 'image',
              url: wx.getStorageSync('bgImg'),
              css: {
                top: '112rpx',
                left: '30rpx',
                right: '32rpx',
                width: '688rpx',
                height: '420rpx',
                borderRadius: '0 0 16rpx 16rpx'
              },
            },
            // {
            //   type: 'image',
            //   url: wx.getStorageSync('userHead') || 'https://qiniu-image.qtshe.com/default-avatar20170707.png',
            //   css: {
            //     top: '404rpx',
            //     left: '328rpx',
            //     width: '96rpx',
            //     height: '96rpx',
            //     borderWidth: '6rpx',
            //     borderColor: '#FFF',
            //     borderRadius: '96rpx'
            //   }wx.getStorageSync('goodName')
            // },

            {
              type: 'text',
              text: wx.getStorageSync('goodName'),
              css: {
                top: '560rpx',
                left: '100rpx',
                width: '508rpx',
                maxLines:2,
                align: 'left',
                fontWeight: 'bold',
                fontSize: '44rpx',
                color: '#3c3c3c',
                wordWrap: 'break-word',
                wordBreak: 'normal'
              }
            },
            {
              type: 'text',
              text: wx.getStorageSync('price') ? `¥${wx.getStorageSync('price')}` + `${wx.getStorageSync('unit') ? `/${wx.getStorageSync('unit')}` : ''}` : '',
              css: {
                top: '702rpx',
                fontSize: '32rpx',
                left: '100rpx',
                align: 'left',
                fontWeight: 'bold',
                color: 'red'
              }
            },

            {
              type: 'text',
              text: `长按识别小程序访问`,
              css: {
                top: '850rpx',
                left: '100rpx',
                align: 'left',
                fontSize: '28rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'image',
              url: wx.getStorageSync('userInvite'),
              css: {
                top: '834rpx',
                left: '470rpx',
                width: '200rpx',
                height: '200rpx'
              }
            }
          ]
        }
      })
    },
    checkEwm() {
      wx.previewImage({
        urls: [this.data.sharePath],
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData')
    },
    preventDefault() { },
    // 保存图片
    savePhoto(path) {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 300)
        },
        fail: (res) => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                this.setData({
                  isModal: true
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 300)
        }
      })
    }
  }
})
