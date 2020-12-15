
let userid='';
let   password = null
Page({
  data:{
    iFucusNum:'',
    username:'',
  

  },
  update_pass(event){
    password = event.detail.value
  },
  // inputFucus(e){
  //   let iFucusNum = e.currentTarget.dataset.index;
  //   this.setData({
  //     iFucusNum: iFucusNum
  //   })
  // },
  //点击设置按钮

  onLoad:function(){
 
    let user = wx.getStorageSync("user");
    console.log(wx.getStorageSync("user"))
    this.setData({
      username:user
    })
   
   wx.cloud.database().collection("user_table").where({
     username: user
   }).get({
     success: (res) => {
       // console.log(this.openid)
       userid=res.data[0]._id
       console.log(res.data[0]._id)
      //  that.setData({
      //    _id: res.data[0]._id
      //  }
      //  )
     }
   })
  
  // console.log("这个数据的id 是"+id)
  },
  //修改用户的密码
    setUp() {
    // console.log(userid)
    // console.log(password)

//调用修改云数据库数据的云函数
    wx.cloud.callFunction({
      name:'update_user',
      data:{
        _id:userid,
        password2:password
      },
      success:function(res){
        console.log(res)
        console.log("密码修改成功！")
        wx.showToast({
          icon:"success",
          title: '修改成功',
          duration:2500,
          success:function(){
            wx.redirectTo({
              url: '../login/login',
            })
          }
        })
      },
      fail:function(err){
        console.log("密码修改失败",err)
        wx.showToast({
          icon:"none",
          title: '修改失败'
        })
      }
    })
    }
})

