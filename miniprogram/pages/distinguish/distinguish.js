Page({
  data: {
    imageUrl:''
  },
  discern(e){
    //获取点击的index值
    let index = e.currentTarget.dataset.index;  //点击的元素的index  1:动物；2:植物；3:果蔬；4:货币；5:通用
    console.log(index)
  

    switch (index){
      case "1": wx.navigateTo({
        url: "/pages/shibie_animal/shibie_animal"
      });
      break;
      case "2": wx.navigateTo({
        url: "/pages/shibie/shibie"
      });
        break;
      case "3": wx.navigateTo({
        url: "/pages/shibie_fruit/shibie_fruit"
      });
        break;
      case "4": wx.navigateTo({
        url: "/pages/shibie_money/shibie_money"
      });
        break;
      case "5": wx.navigateTo({
        url: "/pages/shibie_tongyong/shibie_tongyong"
      });
    }
  }
})