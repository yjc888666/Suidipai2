// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    botany: '',
    botanyimg: {},
    introd: false,
    baikedata: '',
    animation: false,
    aibotany: false,
    aibtn: true,
    nohave: false,
    noflower: '',
    name1:'',
    value1:'',
    year1:''
    
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
        this.moneyCloud(imgbase)
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
  moneyCloud(imgbase) {
    wx.cloud.callFunction({
      name: 'money',
      data: {
        img: imgbase
      }
    })
      .then((res) => {
        console.log(res.result.money.result)
      let botanyimg = res.result.money.result
      console.log(botanyimg)
        //  map遍历
       let  name = botanyimg.currencyName;
       let  value = botanyimg.currencyDenomination;
       let  year = botanyimg.year;
         
        console.log(name,value,year)

       
        //  判断是不是植物
        if (name == "非货币") {
          this.setData({
            aibotany: false,
            aibtn: true,
            animation: false,
            nohave: true,
            noflower: '没有识别货币'
          })
        } else {
          this.setData({
           
            animation: false,
            aibotany: true,
            aibtn: true,
            name1:name,
            value1:value,
            year1:year

          })
          return {
            name,
            value,
            year
         
          }
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

  // 跳转到海报绘制页
  shAre() {
    let aiimg = this.data.botany
    let ainame = this.data.botanyimg.currencyName
    wx.navigateTo({
      url: '../poster/poster?aiimg=' + aiimg + '&ainame=' + ainame
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "拍照就能识别是什么食材，你也来试试",
      imageUrl: "../../images/yingc.jpg",
      path: "/pages/index/index"
    }
  }

})