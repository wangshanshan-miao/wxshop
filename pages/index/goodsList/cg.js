// pages/index/cg/cg.js
import api from "../../../utils/api.js"
import {
    baseURL,
    imgBaseUrl
} from "../../../utils/http.js"
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        toView : '',
        id: '', // 联盟id
        isRequest: false,
        pageNum: 1,
        arr: [],
        tabIndex : 0 , // 当前联盟序号
    },
    // 回到顶部
    toTop() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },
    fl(){
        wx.navigateTo({
          url: '/pages/index/lghd/lghd',
        })
    },
    // 切换联盟
    switch (e) {
        const id = app.getValue(e).id
        const index = app.getValue(e).index
        // console.log(index)
        this.setData({
            isRequest: false,
            arr: [],
            pageNum: 1,
            id: id,
            tabIndex : index,
            toView : "s" + index 
        })
        this.buildinglList()
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
                this.buildinglList()
            }
        }
    },
    // 联盟商品列表 
    buildinglList() {
        api.allAllianceCommodity({
            allianceId: this.data.id,
            pageNum: this.data.pageNum,
            pageSize: 10
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                arr: [...this.data.arr, ...data.list],
                pageNum: data.pageNum,
                totalPage: data.totalPage
            })
        })
    },
    // 地区内商户联盟查询 上面的
    allianceList() {
        api.allianceList({
            areaCode: wx.getStorageSync('areaCode'),
            pageNum: 1,
            pageSize: 10,
            merchantType : 0
        }).then(res => {
            // console.log(res)
            const data = res.data
            this.setData({
                topArr: data.list,
                id: data.list[this.data.tabIndex].allianceId
            })
            this.buildinglList()
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
        const index = options.index
        if (index) {
            this.setData({
                tabIndex : index,
                toView : "s" + index
            })
        }
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
        this.setData({
            arr : [],
            pageNum : 1
        })
        this.allianceList()
    },
    goDztj() {
        let i = this.data.tabIndex
        let id = this.data.topArr[i].allianceId
        wx.navigateTo({
            url: `../dztj/dztj?id=${id}`,
        });
    },
    // 全部商家
    goShops() {
        let i = this.data.tabIndex
        let id = this.data.topArr[i].allianceId
        wx.navigateTo({
            url: `../shops/shop?type=${id}`,
        });
    },
    goLghd() {
        let i = this.data.tabIndex
        let id = this.data.topArr[i].allianceId
        wx.navigateTo({
            url: '../lghd/lghd?id=' + id,
        });
    },
    goAl() {
        let i = this.data.tabIndex
        let id = this.data.topArr[i].allianceId
        wx.navigateTo({
            url: `../al/al?id=${id}`,
        });
    },
    // 商品详情
    detail(e) {
        const id = app.getValue(e).id
        wx.navigateTo({
            url: `/pages/goodsDe/index?id=${id}`
        })
    },
})