const baseURL = 'https://www.ykdzw.com/unite/';


const imgBaseUrl ='https://www.ykdzw.com/oss/data/'
const imgUrl = 'https://www.ykdzw.com/oss/img/'
const appId = wx.getAccountInfoSync().miniProgram.appId
wx.setStorageSync('appId', appId);
class Http {
  request(url, data = {}, method = 'GET', header) {
    return new Promise((reslove, reject) => {
      return wx.request({
        method: method,
        url: baseURL + url,
        data: {
          // userId: wx.getStorageSync('userId'),
          ...data,
        },
        dataType: 'json',
        header: {
          'content-type': 'application/json',
          ...header
        },
        success(res) {
          if (res.data.status == 200) {
            reslove(res.data)
          } else if (res.data.status == 403) {
            wx.reLaunch({
              url: '/pages/login/index',
            })
          } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
          })
            reslove(res.data)
          }
        },
        fail: (error) => {
          wx.showToast({
            title: '抱歉,网络错误',
            icon: "none"
          })
          reject(error);
        }
      })
    })
  }
}

export {
  Http,
  baseURL,
  imgBaseUrl,
  appId,
  imgUrl
};