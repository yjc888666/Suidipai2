const app = getApp();
const cwx = require('../SocicalCircle/SocialCircleDetail/profunc.js')
const db = wx.cloud.database();
let circles_list = db.collection('circles_list');
Page({
  data: {
    infoList:[],
    isHideLoadMore: false,
    
  },

  onLoad: function () {
    // var that=this;
    // that.onPullDownRefresh();
  if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      //从数据库中读取该用户的发表文章数
      circles_list.where({
        avatar: app.globalData.userInfo.avatarUrl
      }).get({
        
        success: (res) => {
         // console.log(this.openid)
           console.log(res)
          this.setData({
            infoList: res.data
          }
          )
        }
      })

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
 

  //添加评论页面
  addComment(){
    wx.navigateTo({
      url: "/pages/addComment/addComment"
    })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    var that=this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function(){
      that.onLoad();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
  //加载更多
  onReachBottom: function () {
    console.log('加载更多')
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
      })
    }, 1000)
  },
  
  //点击进入详情页面
  detailsInfo(e){


    var id = e.currentTarget.dataset.id;
    circles_list.doc(id).get({
      success: (res) => {
        // console.log(this.openid)
          //  lists=res.data;
        // this.setData({
        //   lists: res.data
        // } )
        wx.setStorage({
          key: 'selcircle',
          data: res.data
        })
       
      }
    })
    //console.log("这是list" + lists)
    console.log(e.currentTarget.dataset.id)
 
    wx.navigateTo({
      url: '/pages/SocicalCircle/SocialCircleDetail/SocialCircleDetail?_id=' + id
    })
  } ,
  //长按删除
  delete_circle(e){ 
     wx.showModal({
       title:'提示',
       content:'确定要删除么？',
       success:function(res){
         if(res.confirm){
           let  id = e.currentTarget.dataset.id;
  
           wx.cloud.callFunction({
             name: 'delete_circles',
             data: {
               _id: id
             },
             success: function (res) {
               console.log(id)
               console.log("删除成功！")
               wx.showToast({
                 icon: "success",
                 title: '删除成功',
                 duration: 1500,
                 success: function () {
                 }
               })
             },
             fail: function (err) {
               console.log(id)
               console.log("删除失败", err)
               wx.showToast({
                 icon: "none",
                 title: '删除失败'
               })
             }
           })
         }else if(res.cancel) {
            console.log('取消啦')
            return false 
         }
       }
     })

  }
})