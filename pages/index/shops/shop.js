//index.js
//获取应用实例
import api from "../../../utils/api"
import {
    baseURL,
    imgBaseUrl,
    imgUrl
} from "../../../utils/http"
const app = getApp()

Page({
    data: {
        imgArr: [],
        list: [],
        isRequest: false,
        pageNum: 1,
        type :''
    },
    fl(){
        wx.navigateTo({
          url: '/pages/index/lghd/lghd',
        })
    },
    detail(e){
        let id = app.getValue(e).id
        wx.navigateTo({
          url: `/pages/goodsDe/index?id=${id}`,
        })
    },
    onLoad: function (option) {
        if (option.type) {
            this.setData({
                type : option.type
            })
        }
        this.setData({
            baseURL,
            imgBaseUrl,
            imgUrl
        })
        this.getSwiper()
    },
    onShow() {
        this.setData({
            list: [],
            pageNum: 1,
            isRequest: false
        })
        this.getAllMerchant()
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
                this.getAllMerchant()
            } else {

            }
        }
    },
    // 轮播
    getSwiper(){
      api.selectAllianceCarouseList({
        allianceId:this.data.type
      }).then(res=>{
        this.setData({
          imgArr: res.data.carouselUrl.indexOf(',') != -1 ? res.data.carouselUrl.split(',') : [res.data.carouselUrl]
        })
       
      })
      return false;
        api.getSwiper({
            areaCode : wx.getStorageSync('areaCode'),
            site : 5
        }).then(res=>{
            // console.log(res)
            if (res.status == 200) {
                this.setData({
                    imgArr : res.data.carouselList
                })
            }
        })
    },
    // 全部商家 联盟商家列表
    getAllMerchant() {
        const arr = this.data.list
        wx.showLoading({
            title: '加载中...',
        })
        api.allianceMerchant({
            pageNum: this.data.pageNum,
            pageSize: 10,
            allianceId	: this.data.type
        }).then(res => {
            console.log(res)
            const data = res.data
            wx.hideLoading({})
            this.setData({
                totalPage: data.totalPage,
                pageNum: data.pageNum,
                list: [...arr, ...data.list],
                isRequest: false
            })
        })
    },
    toSearch() {
        wx.navigateTo({
            url: '../../search/index/index',
        });
    },
    // 进店
    goShopDe(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `../../store/store?id=${id}`
        })
    }
})