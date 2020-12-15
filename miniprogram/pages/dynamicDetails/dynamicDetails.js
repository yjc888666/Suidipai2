Page({
  data: {
    dynamicId:'',    // 点击查看详情页的id
    dynamicData: {}, // 点击查看详情页的数据
    isLike: false  // 是否点赞喜欢 false:没有点赞;true点赞
  },
  onLoad(e){
    const id = e.id;
    const data = wx.getStorageSync('dynamicData');
    this.setData({
      dynamicId:id,
      dynamicData:data[0]
    });
  },
  dianZan(){
    let islike = this.data.isLike;
    this.setData({
      isLike: !islike
    })
  }
})