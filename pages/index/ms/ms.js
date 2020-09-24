// pages/index/ms/ms.js
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http"
let app = getApp();
let timer
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dataImg: [],
        tabIndex: 0,
        arr: [],
        isRequest: false,
        pageNum: 1,
        id : '',
        hideType:false
    },
    // 回到顶部
    toTop() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },
    // 获取轮播图
    swiper() {
      api.selectAllianceCarouseList({
        allianceId: this.data.id
      }).then(res => {
        this.setData({
          dataImg: res.data.carouselUrl.indexOf(',') != -1 ? res.data.carouselUrl.split(',') : [res.data.carouselUrl]
        })

      })
      return false;
        api.getSwiper({
            areaCode: wx.getStorageSync('areaCode'),
            site: 2
        }).then(res => {
            // console.log("轮播图", res)
            this.setData({
                dataImg: res.data.carouselList
            })
        })
    },
    // 限时秒杀
    selectSeckill() {
        api.selectSeckill({
            areaCode: wx.getStorageSync('areaCode')
        }).then(res => {
            // console.log(res)
            if (res.status == 200) {
                const data = res.data
                this.setData({
                    type: data.type,
                    seckillId: data.seckillId,
                    startTime: data.startTime,
                    endTime: data.endTime
                })
            }
        })
    },
    // 一级分类
    getList() {
        api.getAllClass({
            areaCode: wx.getStorageSync('areaCode')
        }).then(res => {
            // console.log(res.data[0].classId)
            this.setData({
                list: res.data,
                classId: res.data[0].classId
            })
        })
    },
    // 二级分类
    category() {
        const arr = this.data.arr
        wx.showLoading({
            title: '加载中...',
        })
        api.seckillList({
            seckillId : this.data.seckillId,
            classId: this.data.classId,
            pageNum: this.data.pageNum,
            pageSize: 10,
            allianceId : this.data.id
        }).then(res => {
            // console.log(res)
            wx.hideLoading({})
            if (res.status == 200) {
                const data = res.data
                this.setData({
                    totalPage: data.totalPage,
                    pageNum: data.pageNum,
                    arr: [...arr, ...data.list],
                    isRequest: false
                })
            } else {
                /* wx.navigateBack({
                  complete: (res) => {},
                }) */
            }
        })
    },
    // 秒杀详情页面
    detail(e) {
        const id = app.getValue(e).id // 拼团id
        // console.log(id)
        wx.navigateTo({
            url: `/pages/msDe/index?id=${id}`,
        })
    },
    onReachBottom() {
        const isRequest = this.data.isRequest
        const pageNum = this.data.pageNum
        const totalPage = this.data.totalPage
        // 当前页数小于总页数
        if (pageNum < totalPage) {
            if (!isRequest) {
                this.setData({
                    pageNum: pageNum + 1,
                    isRequest: true
                })
                this.category()
            } else {

            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    reduce() {
        const self = this
        timer = setInterval(() => {
            let endTime = this.data.endTime
            let diff = endTime - new Date().getTime()
            if (diff <= 0) {
                clearInterval(timer)
                self.setData({
                    diff: false
                })
                return
            }
            self.setData({
                nowTime: new Date().getTime()
            })
        }, 1000);
    },
    onLoad: function (options) {
        this.setData({
            nowTime : new Date().getTime(),
            baseURL,
            imgBaseUrl,
            id : options.id,
          hideType: options.type ? options.type==1?true:false:false,
          imgUrl
        })
        this.reduce()
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
        this.selectSeckill()
        this.setData({
            arr: [],
            pageNum: 1,
            isRequest: false
        })
        this.swiper()

        api.getAllClass({
            areaCode: wx.getStorageSync('areaCode')
        }).then(res => {
            this.setData({
                list: [{
                    name: '全部',
                    classId: null
                }, ...res.data]
            })
            this.category()
        })
    },
    // tab切换
    choseType(e) {
        const classId = app.getValue(e).id
        // console.log(classId)
        this.setData({
            tabIndex: app.getValue(e).index,
            classId,
            arr: [],
            pageNum: 1,
            isRequest: false
        })
        this.category()
    },
    // 详情
    detail(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/msDe/index?id=${id}`,
        })
    }
})