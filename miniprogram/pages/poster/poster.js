// pages/poster/poster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    postUrl:'',
    showing:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // loading加载
    wx.showLoading({
      title: '生成中',
    })
    console.log(options)
    // promise.all,并发请求
    // 首先进入当前页面要取到三张图片来准备绘制

    // 背景图片
    let poster1 = new Promise((resolve,reject)=>{
      wx.getImageInfo({
        src: '../../images/poatera.png',
        success:(res)=>{
          resolve(res)
        }
      })
    });

    //请求图片
    let poster2 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: options.aiimg,
        success: (res) => {
          resolve(res)
          console.log(res)
          this.setData({
            imgUrl:res.path
          })
        }
      })
    });

    //请求小程序码
    let poster3 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: '../../images/code.jpg',
        success: (res) => {
          resolve(res)
        }
      })
    });

  // 并发请求
    Promise.all([poster1, poster2, poster3])
      .then((res)=>{
        console.log(res)
        // 取到三张图片的地址
        var postimg = res[0].path,
            flowimg = res[1].path,
            codeimg = res[2].path,
            // 画布的宽高
            height = 500,
            width = 300,
            // 取到花的图片的原始宽高
          img_width = res[1].width,
          img_height = res[1].height;


      //请求三张图片成功后在这里开始绘制海报
      
      // 要获取上下文的 <canvas> 组件 canvas-id 属性
        const ctx = wx.createCanvasContext('shareImg')

      //对花的图片进行裁剪
      var can_left,//左偏移值
          can_top, //上偏移值
          can_width,//裁剪宽度
          can_height,//裁剪高度
        can_height = img_width * (300/500);

        if (can_height > img_height){
          console.log('1111')
          can_height = img_height;
          can_width = can_height*(500/300);
          can_left = (img_width - can_width) / 2;
          can_top = 0;
        }else{
          console.log('222')
          can_left = 0;
          can_top = (img_height - can_height) /2;
          can_width = img_width
        }

      //绘制背景图片
        ctx.drawImage('../../' + postimg, 0, 0, width,height)
      //绘制狗的图片
        ctx.drawImage(this.data.imgUrl, can_left, can_top, can_width, can_height, 0, 0, width, 200)
        // 绘制小程序码,100,100
        ctx.drawImage('../../' + codeimg, (width-100)/2, 330, 100, 100)

        // 绘制文字
        ctx.setTextAlign('center')//文字居中
        ctx.setFillStyle('rgb(253,251,250)')//绘制颜色
        ctx.setFontSize(15)//文字颜色
        ctx.fillText('看到不认识的东西', width/2, 240)
        ctx.fillText('小程序扫一扫就知道', width / 2, 280)
        ctx.fillText('随地拍', width / 2, 450)
        ctx.fillText(options.ainame, width / 2, 190)
      
      // 开始绘制
        ctx.draw(true,setTimeout(()=>{
          this.showimg()
        },1500))

      })
      .catch((Error)=>{
        console.log(Error)
      })

  },


  // 生成图片
  showimg: function (){
    wx.canvasToTempFilePath({
      canvasId:'shareImg',
      success:(res)=>{
        // 隐藏loading
        wx.hideLoading()
        console.log(res)
        this.setData({
          postUrl: res.tempFilePath,
          showing:true
        })
      },

      fail:(error)=>{
        console.log(error)
      }
    })
  },

  // 保存到本地相册
  saveImg(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.postUrl,
      success:(res)=>{
        console.log('保存成功')
        wx.showModal({
          title: '图片已保存到相册',
          content: '快去分享到朋友圈吧',
          showCancel:false,
          confirmText:'我知道了',
          success:(res)=>{
            console.log('点了我知道了')
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail:(error)=>{
        console.log(error)
      }
    })
  },


// 分享给好友
onShareAppMessage:function(){
  return{
    title:'拍照就能识别万物,你也来试试',
    imageUrl: this.data.postUrl,
    //"../../images/yingc.jpg",
    path:'pages/index/index'
  }
}

})