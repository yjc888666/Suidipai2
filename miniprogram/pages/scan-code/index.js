import drawQrcode from '../../utils/qrcode.js'

Page({
  data: {
    result: '',
    inputValue: ''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      result: options.title

    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getcode: function(e) {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      // typeNumber: 10,
      text: e.target.dataset.code
    })
    wx.canvasToTempFilePath({
      fileType: 'jpg',　　　
      canvasId: 'myQrcode', //通过id 指定是哪个canvas
      success(res) {　
        //成功之后保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function(res) {
            // console.log(res)
          }
        })
      }
    })
  },

  onHide: function() {
    var that = this
    that.setData({
      result: ''
    })
  },
 
  copy: function(e) {
    if (e.currentTarget.dataset.text.length > 0) {
      var that = this
      that.setData({
        result: ''
      })
      wx.setClipboardData({
        data: e.currentTarget.dataset.text
      })

    }
  }
})