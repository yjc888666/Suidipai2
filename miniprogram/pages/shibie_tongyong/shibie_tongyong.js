// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    botany: '',
    botanyimg: [],
    introd: false,
    baikedata: '',
    animation: false,
    aibotany: false,
    aibtn: true,
    nohave: false,
    noflower: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 选择本地图片
  faceImage() {
    console.log('111')
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        // 解码图片base64
        var imgbase = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        console.log(imgbase)
        // 调用云函数
        this.tongyongCloud(imgbase)
        this.setData({
          botany: tempFilePaths,
          animation: true,
          aibtn: false,
          aibotany: false,
          nohave: false
        })
      },

      fail: (err) => {
        console.log(err)
      }
    })
  },

  // 调用后端云函数
  tongyongCloud(imgbase) {
    wx.cloud.callFunction({
      name: 'tongyong',
      data: {
        img: imgbase
      }
    })
      .then((res) => {
        //  console.log(res.result.flower.result)
        let botanyimg = res.result.tongyong.result
        //  map遍历
        let botanydata = botanyimg.map((item) => {
          let name = item.keyword;
          let score = item.score;
          let baike = item.baike_info
          return {
            name,
            score,
            baike
          }
        })

        console.log(botanydata)
        //  判断是不是植物
        if (botanydata[0].name == "非物体") {
          this.setData({
            aibotany: false,
            aibtn: true,
            animation: false,
            nohave: true,
            noflower: '没有识别到物体'
          })
        } else {
          this.setData({
            botanyimg: botanydata,
            animation: false,
            aibotany: true,
            aibtn: true
          })
        }

      })
      .catch((Error) => {

        console.log('出错啦', Error)
        // 请求出现错误提示
        this.setData({
          aibotany: false,
          aibtn: true,
          animation: false,
          nohave: true,
          noanimal: '网络错误请重新上传'
        })
      })

  },

  // 百度百科展示
  baike: function (event) {
    console.log(event.currentTarget.dataset.testid)
    let baikedata = event.currentTarget.dataset.testid
    this.setData({
      introd: true,
      baikedata: baikedata
    })
  },

  // 取消百科内容
  introdbaike() {
    this.setData({
      introd: false
    })
  },

  // 跳转到海报绘制页
  shAre() {
    let aiimg = this.data.botany
    let ainame = this.data.botanyimg[0].name
    wx.navigateTo({
      url: '../poster/poster?aiimg=' + aiimg + '&ainame=' + ainame
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "拍照就能识别万物，你也来试试",
      imageUrl: "../../images/yingc.jpg",
      path: "/pages/index/index"
    }
  }

})