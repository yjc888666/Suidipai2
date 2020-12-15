//获取应用实例
const app = getApp()
//获取云数据库引用
const db = wx.cloud.database();
let circles_list = db.collection('circles_list');
let thumbs_list = db.collection("thumbs_list");
Page({
  data:{
    userInfo:{},    // 用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    publish: "",   //发表
    like: "",  //喜欢
    news: 0, // 消息
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
        //从数据库中读取该用户的发表文章数
      circles_list.where({
        avatar: app.globalData.userInfo.avatarUrl
      }).get({
        success:(res)=>{
          let cirCount=res.data.length;
         this.setData({
            publish: cirCount
          }
         )
        }
      })
      thumbs_list.where({
        userid: app.globalData.userInfo.userid
      }).get({
        success: (res) => {
          console.log(res.data.length)
          console.log()
          let likeCount = res.data.length;
          this.setData({
            like: likeCount
          }
          )
        }
      })
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })    
         
        }
      })
    }
   
  },
  onPullDownRefresh() {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      // complete
      that.onLoad();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);

  }
  ,

  toDetail(){
    wx.navigateTo({
      url: '/pages/dynamic/dynamic',
    }) 
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  // 修改密码
  revisePwd(){
    wx.navigateTo({
      url: "/pages/revisePwd/revisePwd"
    })
  },
  //退出登录
  signOut(){
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗 ？',
      confirmColor: '#0dbc5d',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        wx.clearStorage();
          wx.redirectTo({
            url: '/pages/login/login'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})