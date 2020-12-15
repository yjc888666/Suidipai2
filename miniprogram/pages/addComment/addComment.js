Page({
  data: {
    isPhoto:false,
    photoUrl:'',
    value:''
  },
  //点击上传图片
  addPhoto(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if(tempFilePaths && tempFilePaths!=''){
          that.setData({
            isPhoto:true,
            photoUrl:tempFilePaths
          })
        }
      
      }
    })
  },
  //实时监听textarea的变化
  valueChange(e){
    const textValue = e.detail.value
      this.setData({
        value:textValue
      })
  },
  //点击发表
  uploadImg(){
    let pUrl = this.data.photoUrl;
    let tVal = this.data.value;
    if(!pUrl||pUrl==''){
      wx.showToast({
        title: '您还没有上传图片呢！',
        icon: 'none',
        duration: 2000
      })
    }else if(!tVal||tVal==''){
      wx.showToast({
        title: '您还没发表想法呢！',
        icon: 'none',
        duration: 2000
      })
    }else{
     
      let that = this;
      console.log("您点击啦上传")
      wx.chooseImage({
        
        success(res) {
          console.log("选择成功", res)
          that.uploadImg(res.tempFilePaths[0])
        }
      })
    }

  },
  uploadImg(fileUrl) {
    wx.cloud.uploadFile({

      cloudPath: new Date().getTime() + 'py.png',
      filePath: fileUrl,
      success: res => {
        //返回文件id
        console.log("上传成功", res);
        this.setData({
          imgUrl: res.fileID
        })
      },
      fail: console.error
    })
  }

})