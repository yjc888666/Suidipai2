let app = getApp();
//获取云数据库引用
const db = wx.cloud.database();
const user_table = db.collection('user_table');
let regname = null;
let regpassword = null;
let loginname = null;
let loginpassword = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    middleFlip:false,
    iFucusNum:''
  },
  //输入的注册用户名
  regName(event) {
    regname = event.detail.value
  },
  //输入的注册密码
  regPassword(event) {
    regpassword = event.detail.value
  },
  //输入用户名
  inputName (event) {  
    
    loginname = event.detail.value
  },
  //输入密码
  inputPassword(event) {
 
    loginpassword = event.detail.value
  },
  signin(){
    this.middleFlip = !this.middleFlip;
    this.setData({
      middleFlip: !this.middleFlip
    })
  },
  // 点击input框获取焦点
  inputFucus(e){
    let iFucusNum = e.currentTarget.dataset.index;
    this.setData({
      iFucusNum: iFucusNum
    })
  },
  //点击忘记密码
  forgetPwd(){
    wx.navigateTo({
      url: "/pages/revisePwd/revisePwd"
    })
  },
  

  // 点击登陆
  login(){
    let that = this;
   // console.log(loginname,loginpassword)
    //登陆获取用户信息
    user_table.where({
      username: loginname
       
    }).get({
      success: (res) => {
      //  let user = res.data;
       console.log(res);
        //console.log(user.username);
         //遍历数据库对象集合
       if(res.data.length==0){
         console.log("没有这个用户名")
         wx.showToast({
           title: '无此用户名！！',
           icon: 'loading',
           duration: 2000
         })
       }
       else {
         if(res.data[0].password!==loginpassword){
           console.log('密码错误！'),
             wx.showToast({
               title: '密码错误！！',
             icon: 'loading',
               duration: 2000
             })
         }
         else {
           console.log('登陆成功！')
           wx.showToast({
             title: '登陆成功！！',
             icon: 'success',
             duration: 3000
           })
           wx.setStorage({
             key:'user',
             data: loginname
           })
           wx.redirectTo({
             //跳转首页
             url: '/pages/in/in'  //这里的URL是你登录完成后跳转的界面
           })
         }
       }
      },
      fail:(res)=>{
        console.log("发生错误")
      }
    })
  
  },
  //点击注册
  register(){
    let that = this;
    let flag = false  //是否存在 true为存在
    console.log(regname,regpassword)
    //查询用户是否已经注册
    user_table.get({
      success: (res) => {
        let admins = res.data;  //获取到的对象数组数据
        //  console.log(admins);
        for (let i = 0; i < admins.length; i++) {  //遍历数据库对象集合
          if (regname === admins[i].username) { //用户名存在
            flag = true;
            //   break;
          }
        }
        if (flag === true) {    //已注册
          wx.showToast({
            title: '账号已注册！',
            icon: 'success',
            duration: 2500
          })
        } else {  //未注册
          that.saveuserinfo()
        }
      }
    })
  },
  //注册用户信息
  saveuserinfo() {
    // let that = this;
    user_table.add({  //添加数据
      data: {
        username: regname,
        password: regpassword
      }
    }).then(res => {
      console.log('注册成功！')
      wx.showToast({
        title: '注册成功！',
        icon: 'success',
        duration: 3000
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化加载，先判断用户登录状态
    if (wx.getStorageSync('user')) {
      console.log("有缓存")
      wx.redirectTo({
        url: ' pages/in/in'
      })
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})