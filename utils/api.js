import {
  Http,
    baseURL,
    imgBaseUrl
} from "./http.js"

// api 接口参数说明  url data(默认为{}) method(默认为GET)
class Api extends Http {
  // 登录
  login(data) {
    return this.request('api/user/login', data, 'POST')
  }
  // 注册
  register(data) {
    return this.request('api/user/register', data, 'POST')
  }
  // 获取openId
  getOpenid(data) {
    return this.request('api/WeiXin/GetWXOpenid', data)
  }
  // 获取用户手机号
  getUserPhone(data) {
    return this.request('api/WeiXin/deciphering', data)
  }
  // 轮播图
  getSwiper(data) {
    return this.request('api/home/selectCarouseList', data, 'POST')
  }
  // 获取经销商iD
  getAgencyId(data) {
    return this.request('api/common/getAgencyId', data, 'POST')
  }
  // 首页
  home(data) {
    return this.request('api/home/homePage', data, 'POST')
  }
  // 搜索结果
  searchResult(data) {
    return this.request('api/home/searchResult', data, 'POST')
  }
  // 清除搜索记录
  clearHistory(data) {
    return this.request('api/home/delSearch', data, 'POST')
  }
  // 搜索历史
  searchHistory(data) {
    return this.request('api/home/search', data, 'POST')
  }
  // 一站采购或一站家装或生活联盟列表
  buildinglList(data) {
    return this.request('api/buildingl/buildinglList', data, 'POST')
  }
  // 地区内商户联盟查询
  allianceList(data) {
    return this.request('api/buildingl/allianceList', data, 'POST')
  }
  // 获取数组字典公共方法接口地址
  getDictValue(data) {
    return this.request('api/common/getDictValue', data)
  }
  // 全部商家
  allMerchant(data) {
    return this.request('api/home/AllMerchant', data, 'POST')
  }
  // 联盟商家列表
  allianceMerchant(data) {
    return this.request('api/buildingl/AllMerchant', data, 'POST')
  }
  // 商家详情
  merchantDetail(data) {
    return this.request('api/merchant/merchantDetail', data, 'POST')
  }
  // 商家内搜索
  searchGoods(data) {
    return this.request('api/merchant/searchCommodityResult', data, 'POST')
  }
  // 案例展示
  getCaseList(data) {
    return this.request('api/merchant/getCaseList', data, 'POST')
  }
  // 案例详情
  caseDetail(data) {
    return this.request('api/merchant/getCaseDetail', data, 'POST')
  }
  // 取消/收藏商家或商品
  collect(data) {
    return this.request('api/commodity/collect', data, 'POST')
  }
  // 商品详情
  goodDetail(data) {
    return this.request('api/commodity/commodityDetail', data, 'POST')
  }
  // 全部评价
  comments(data) {
    return this.request('api/merchant/commodityList', data, 'POST')
  }
  // 收货地址列表
  addressList(data) {
    return this.request('api/address/getAddressList', data, 'POST')
  }
  // 加入购物车
  addToCart(data) {
    return this.request('api/shoppingTrolley/saveCommoditySpecification', data, 'POST')
  }
  // 我的购物车
  myCart(data) {
    return this.request('api/shoppingTrolley/getCommoditySpecificationDetail', data, 'POST')
  }
  // 购物车管理 （删除商品）
  delete(data) {
    return this.request('api/shoppingTrolley/delCommoditySpecification', data, 'POST')
  }
  // 改变购物车商品数量
  changeNum(data) {
    return this.request('api/shoppingTrolley/changeTrolleyAmount', data, 'POST')
  }
  // 商品规格
  commoditySpecification(data) {
    return this.request('api/shoppingTrolley/getCommoditySpecification', data, 'POST')
  }
  // 代金券列表
  getVoucherList(data) {
    return this.request('api/common/getVoucherList', data, 'POST')
  }
  // 购买代金券
  bugVoucher(data) {
    return this.request('api/userVoucher/bugVoucher', data, 'POST')
  }
  // 消息列表
  messageList(data) {
    return this.request('api/message/getMessageList', data, 'POST')
  }
  // 工匠列表
  getCraftsmanList(data) {
    return this.request('api/craftsman/getCraftsmanList', data, 'POST')
  }
  // 我的
  userInfo(data) {
    return this.request('api/user/userDetail', data, 'POST')
  }
  //  查询个人基本信息
  userBaseInfo(data) {
    return this.request('api/user/selectUserDetail', data)
  }
  //   个人主页信息
  selectUserDetail(data) {
    return this.request('api/user/selectDetail', data)
  }
  // 修改头像或昵称
  updateUserDetail(data) {
    return this.request('api/user/updateUserDetail', data, 'POST')
  }
  // 我的佣金
  commission(data) {
    return this.request('api/commission/commissionDetail', data)
  }
  // 佣金收入、支出
  commissionList(data) {
    return this.request('api/commission/commissionList', data, 'POST')
  }
  // 提现申请
  deposit(data) {
    return this.request('api/commission/deposit', data, 'POST')
  }
  // 分销奖励详情
  commissionDetail(data) {
    return this.request('api/commission/commissionDetail', data, 'POST')
  }
  // 支出详情
  commissionOutDetail(data) {
    return this.request('api/commission/commissionOutDetail', data, 'POST')
  }
  // 商品收藏列表
  collectCommodityList(data) {
    return this.request('api/collect/collectCommodityList', data, 'POST')
  }
  // 商家收藏列表
  collectMerchantList(data) {
    return this.request('api/collect/collectMerchantList', data, 'POST')
  }
  // 我的优惠券 分类列表
  voucherList(data) {
    return this.request('api/userVoucher/selectVoucherList', data, 'POST')
  }
  // 管理优惠券 删除
  deleteVoucher(data) {
    return this.request('api/userVoucher/delUserVoucher', data, 'POST')
  }
  // 已拥有优惠券详情
  voucherDetail(data) {
    return this.request('api/userVoucher/selectVoucherDetail', data, 'POST')
  }
  // 可用优惠券列表
  usableVoucherList(data) {
    return this.request('api/common/getUsableVoucherList', data, 'POST')
  }
  // 使用优惠券（核销）
  userVoucher(data) {
    return this.request('api/userVoucher/useUserVoucher', data, 'POST')
  }
  // 抵扣券详情（未拥有）
  getVoucherDetail(data) {
    return this.request('api/common/getVoucherDetail', data, 'POST')
  }
  // 申请退券
  backUserVoucher(data) {
    return this.request('api/userVoucher/backUserVoucher', data, 'POST')
  }
  // 商家申请入驻
  applyMerchant(data) {
    return this.request('api/merchant/applyMerchant', data, 'POST')
  }
  // 获取地址列表
  getAddressList(data) {
    return this.request('api/address/getAddressList', data, 'POST')
  }
  // 收获地址详情
  getAddressDetail(data) {
    return this.request('api/address/getAddressDetail', data, 'POST')
  }
  // 新增、编辑收货地址
  addAddress(data) {
    return this.request('api/address/addAddress', data, 'POST')
  }
  // 设置默认地址、删除地址
  changeAddress(data) {
    return this.request('api/address/changeAddress', data, 'POST')
  }
  // 邀请列表
  inviterList(data) {
    return this.request('api/user/selectInviterUser', data, 'POST')
  }
  // 商务合作申请
  cooperation() {
    return this.request('api/merchant/applyBusinessCooperation')
  }
  // 生成测量订单
  createMetricalOrder(data) {
    return this.request('api/order/createMetricalOrder', data, 'POST')
  }
  // 生成商品订单
  createCommodityOrder(data) {
    return this.request('api/order/createCommodityOrder', data, 'POST')
  }
  // 我的订单列表
  orderList(data) {
    return this.request('api/order/selectMyOrderList', data, 'POST')
  }
  // 订单详情
  orderDetail(data) {
    return this.request('api/order/getCommodityOrder', data, 'POST')
  }
  // 结算商品订单
  settleCommodityOrder(data) {
    return this.request('api/order/settleCommodityOrder', data, 'POST')
  }
  // 取消/删除/退款/确认收货商品订单
  delCommodityOrder(data) {
    return this.request('api/order/delCommodityOrder', data, 'POST')
  }
  // 评价订单
  addEvaluate(data) {
    return this.request('api/evaluate/addEvaluate', data, 'POST')
  }
  // 获取全部商品一级分类
  getAllClass(data) {
    return this.request('api/common/getAllClassByAreaCode', data, 'POST')
  }
  // 拼团活动列表
  groupBookingList(data) {
    return this.request('api/groupBooking/groupBookingList', data, 'POST')
  }
  // 拼团活动详情
  groupBookingDetail(data) {
    return this.request('api/groupBooking/groupBookingDetail', data, 'POST')
  }
  // 发起、参加拼团
  addGroupBooking(data) {
    return this.request('api/groupBooking/addGroupBooking', data, 'POST')
  }
  // 参加拼团列表
  groupUserList(data) {
    return this.request('api/groupBooking/groupUserList', data, 'POST')
  }
  // 是否有限时秒杀
  selectSeckill(data) {
    return this.request('api/seckill/selectSeckill', data, 'POST')
  }
  // 限时秒杀商品列表
  seckillList(data) {
    return this.request('api/seckill/seckillList', data, 'POST')
  }
  // 限时秒杀详情
  seckillDetail(data) {
    return this.request('api/seckill/seckillDetail', data, 'POST')
  }
  // 样品清仓商品列表
  clearanceSaleList(data) {
    return this.request('api/clearanceSale/clearanceSaleList', data, 'POST')
  }
  // 样品清仓详情
  clearanceSaleDetail(data) {
    return this.request('api/clearanceSale/clearanceSaleDetail', data, 'POST')
  }
  // 获取区域代理电话
  getPhone(data) {
    return this.request('api/common/getCraftsmanPhone', data, 'POST')
  }
  // 消息详情
  messageDetail(data) {
    return this.request('api/message/getMessageDetail', data, 'POST')
  }
  // 获取微信token
  getWXToken(data) {
    return this.request('/api/common/getWXToken', data, 'GET')
  }
  // 获取区域代理商代理的所有区域
  getAllArea(data) {
    return this.request('api/common/selectAgencyAreaCodeByAreaCode', data, 'POST')
  }
  // 联盟商品列表
  allAllianceCommodity(data) {
    return this.request('api/buildingl/allAllianceCommodity', data, 'POST')
  } 
  // 检查手机号
  checkPhone(data) {
    return this.request('api/user/checkPhone', data)
  }
  // 获取所有参团人员信息
  getAllGroupUser(data) {
    return this.request('api/groupBooking/getAllGroupUser', data)
  }

  // 是否上线
  isOnLine(data) {
    return this.request('/api/common/online', data)
  }
  // 邀请二维码
  getinviteCode(data) {
    return this.request('api/common/getMiniQrQr', data)
  }
  // 查询联盟轮播图 
  selectAllianceCarouseList(data) {
    return this.request('api/home/selectAllianceCarouseList', data)
  }
}

const api = new Api;

export default api;