const app = getApp();
const usecloud = true; //是否使用 云开发 正式开发环境中使用 application.js 中的配置
const db = wx.cloud.database();
const timeutil = require('../../../utils/TimeUtil.js');
const cwx = require('profunc.js');
Page({
  data: {
    id: '',
    circleitem: null,
    content: '',
    comments: [],
    liked: true
  },
  onLoad() {
    var that = this;
    // console.log(options.id)
    //console.log(app.globalData.userInfo)

    wx.getStorage({
      key: 'selcircle',
      success(res) {
        console.log(res)
        that.setData({
          circleitem: res.data
        }, () => {
          that.reqThumbs();
          that.reqComment();
        })
      }
    })






    // wx.getStorage({
    //   key: 'selcircle2',
    //   success(res) {
    //     console.log(res)
    //     that.setData({
    //       circleitem: res.data
    //     }, () => {
    //       that.reqThumbs();
    //       that.reqComment();
    //     })
    //   }
    // })

  },
  ViewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.imglist,
      current: e.currentTarget.dataset.url
    });
  },
  pubcom() {
    var that = this;
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    cwx.AddRemarks(that.data).then(res => {
      console.log(res);
      that.reqComment();
    })
  },
  reqComment() {
    var that = this;
    if (usecloud) {
      db.collection('remarks_list').where({
        circle_id: that.data.circleitem._id
      }).get().then(res => {
        console.log(res)
        that.setData({
          comments: res.data,
          content: ''
        })
        wx.hideLoading();
      })
    } else {
      //非云开发请求写在这里
    }
  },
  ilike() {
    var that = this;
    if (usecloud) {
      wx.showLoading({})
      cwx.AddThumbs(that.data).then(ans => {
        var titem = that.data.circleitem;
        titem.thumbsnum = titem.thumbsnum + 1
        that.setData({
          liked: false,
          circleitem: titem
        })
        console.log(ans);
        wx.hideLoading()
      })

    } else {
      //非云开发处理方式写在这里
    }
  },
  textAreaBlur(e) {
    //console.log(e)
    this.setData({
      content: e.detail.value
    })
  },
  reqThumbs() {
    //请求点赞的详情
    var that = this;
    if (usecloud) {
      db.collection('thumbs_list').where({
        userid: app.globalData.openid,
        circle_id: that.data.circleitem._id
      }).get().then(res => {
        console.log(res)
        if (res.data.length != 0) {
          that.setData({
            liked: false
          })
        }
      })
    } else {

    }
  },
 
})