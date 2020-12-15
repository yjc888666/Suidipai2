const app = getApp();
const cwx = require('profunc.js')
const db = wx.cloud.database();
Page({
  data: {
    lists: []
  },
  onLoad() {
    //请求数据
    var that = this;
    that.ReqData();
  },
  todetail(e) {
    var tid = e.currentTarget.dataset.id;
    wx.setStorage({
      key: 'selcircle',
      data: this.data.lists[tid]
    })
    wx.navigateTo({
      url: 'SocialCircleDetail/SocialCircleDetail?id=' + tid
    })
  },
  ReqData() {
    wx.showLoading({
      title: '加载中~',
    })
    var that = this;
    var len = that.data.lists.length;
    console.log(len)
    //封装获取请求，使用云开发和非云开发使用同一种方式请求
    cwx.QueryCircleInfo(len).then(res => {
      console.log(res)
      if (res.data !='request fail')
      {
        that.setData({
          lists: that.data.lists.concat(res.data)
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },
  onPullDownRefresh() {
    var that = this;
    that.setData({
      lists: []
    }, () => {
      that.ReqData();
    })
  },
  onReachBottom() {
    var that = this;
    that.ReqData();
  },
  ViewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.imglist,
      current: e.currentTarget.dataset.url
    });
  },
  topub(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      console.log('获得授权成功')
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('wxuserinfo', e.detail.userInfo)
      //console.log(e.detail.userInfo)
      wx.navigateTo({
        url: 'SocicalCirclePub/SocialCirclePub',
      })
    } else {
      console.log('获得授权失败')
    }

  },

})