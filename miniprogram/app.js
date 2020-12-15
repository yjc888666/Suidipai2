var pset = require('_self/application.js');
const cloud = require('_self/cloud.js');
App({
  globalData: {
    openid: '',
    userInfo: null
  },
  //先序执行的函数
  onLaunch: function () {
    wx.cloud.init({
      traceUser:true,
      env: "suidipai-fe3rw"
    
    });
    //初始化加载，先判断用户登录状态
    if (wx.getStorageSync('user')) {
      console.log("有缓存")
      wx.redirectTo({
        url: 'pages/in/in'
      })
    } else {
      console.log('没有缓存')
      wx.redirectTo({
        url: 'pages/login/login'
      })
    }

    
    this.CloudServer();
    this.ModeServer();
    this.InitBases();
  },
  CloudServer() {
    var that = this;
    wx.getStorage({
      key: 'wxuserinfo',
      success: function (res) {
        that.globalData.userInfo = res.data
      },
    })
    if (pset.CloudSetting.UseCloud) {
      console.log('* 云开发 * √' + ' 服务器:' + pset.CloudSetting.CloudId)
      if (!wx.cloud) {
        console.log(' -- 不支持云开发 -- ')
      } else {
        wx.cloud.init({
          env: pset.CloudSetting.CloudId,
          traceUser: pset.CloudSetting.TraceUser
        })
        //缓存信息
        cloud.CallCloudFuncAndSetStorge('filter', pset.CloudSetting.AdaptStorge, 'userinfo').then(function (res) {
          if (res != 'callfuncfail') {
            //console.log(res)
            that.globalData.openid = res //给全局变量 openid 赋值
          }
        })

      }
    } else {
      console.log('* 云开发 * X')

    }
  },
  ModeServer() {
    //模式验证函数,检验是否是管理员 用户 / 黑名单用户

  },
  InitBases() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  }
})