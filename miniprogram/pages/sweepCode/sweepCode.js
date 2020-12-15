Page({
  data:{
    img:'',
    scanCodeMsg: "",
    result: ''
  },
  //点击扫描二维码
  scanning(){
    var that =this
    wx.scanCode({
      onlyFromCamera:false,
      scanType:['barCode', 'qrCode'],
      success:function(res){
          console.log(res)
      }
    })
  },
  // 点击来自相册
  choosePohot(){
    var that =this
    wx.chooseImage( {
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [ 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function( res ) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res),
        that.setData({
          img: res.tempFilePaths[0],
          age: "",
          beauty: "",
          expression: "",
          glasses: "",
        }),
        wx.showLoading({
        title: "分析中...",
        mask: true
        }),
        // 将本地资源上传到服务器
        wx.uploadFile({
          url: charmUrl,                     //开发者服务器地址
          filePath: res.tempFilePaths[ 0 ],  //要上传文件资源的路径 (本地路径)
          header:{
             'content-type':'multipart/form-data'
          },
          name: 'file',
          formData: {
            'openId': that.data.openId,
            'nickName': that.data.nickName
          },
          success: function(res) {
            wx.hideLoading();
            var data = res.data;
            var str=JSON.parse(data);
            console.log(str);
            if (str.code==0) {
              that.setData({
                age: str.age,
                beauty: str.beauty,
                expression:str.expression,
                glasses:str.glasses
              })
            } else if (str.code == "1") {
              that.setData({
                info: 'Sorry ' + str.msg
              })
            }else {
              that.setData({
                info: 'Sorry 小程序远走高飞了'
              })
            }
          },
          fail:function(res){
            wx.hideLoading();
            console.log( res )
            that.setData({
              info: '小程序离家出走了稍后再试'
            })
          }
        })
      }
    })
  },
  ////////////////////////////////////////////////////////////
  //扫描二维码方法
  getScan: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        if (res.result) {
             
          wx.navigateTo({
            url: "../scan-code/index?title="+res.result
        
          })
          var result = res.result;

          this.setData({
            result: result,

          })
        } else {
          wx.showToast({
            title: '请重新扫描！',
          })
          return false;
        }

      }, fail: (res) => {
        wx.showToast({
          title: '失败，请重试！',
        })
      }
    })
  },
  //解析链接方法
  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      // console.log("r = " + r)
      // console.log("r[2] = " + r[2])
      return r[2];
    }
    return null;
  }

})