// const baseURL = 'https://www.deejv.com/unite/';
const baseURL = 'https://www.deejv.com/dev/';


const imgBaseUrl ='https://www.deejv.com/obs/'
const appId ='wxa5ecb2822bdfda9e'
class Http {
  request(url, data = {}, method = 'GET', header) {
    return new Promise((reslove, reject) => {
      return wx.request({
        method: method,
        url: baseURL + url,
        data: {
          userId: wx.getStorageSync('userId'),
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
  appId
};