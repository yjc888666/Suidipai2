#### 微信小程序仿朋友圈功能开发（发布、点赞、评论等功能）

[项目如何部署](https://gitee.com/Kindear/CloudUI/blob/master/%E9%83%A8%E7%BD%B2%E6%96%87%E6%A1%A3.md)

> 1.项目分析

项目整体分为三个部分

- 发布
- 展示
- 详情页

***

![](https://img2018.cnblogs.com/blog/1141382/202002/1141382-20200225190457815-1742724859.png)




> 2.数据库设计分析

**所有表共有字段com**

-  create_time              记录的创建时间
-  update_time            记录最近的一次修改时间

**动态表设计 circles_list**

既然是仿朋友圈功能实现，那么数据实体必然包括 文字（主题内容） 和 图片。

- content

- images

发布的信息还要携带上发布者的身份识别码、昵称 和 头像 , 可以选择性的带上位置信息（不需要要进行功能拓展的话就不用加上该字段）。

- userid

- nickname
- avatar
- location

功能中存在 点赞 ， 评论等功能，需要的字段有 点赞数，评论数。

- thumbsnum
- remarksnum

对于每一条记录，都要设置一个主键，唯一识别码 _id

- _id

**点赞表设计 thumbs_list**

设计该表的主要功能是 判断 该用户 是否对某个动态点过赞

- circle_id             点赞的文章id
- userid 
- cancle                true / false 用于配置多次点击取消点赞
-  _id

**评论表设置 remarks_list** 

- circle_id             评论的文章id
- userid 
- content             评论的内容
- avatar               评论者头像
- nickname         评论者昵称
- _id

---

> 3.项目效果

使用的框架 **ColorUI**



**按照顺序展示**

1.发布界面

![](https://gitee.com/Kindear/BlogAssets/raw/master/cnblogs/20200301202220.png)


2.展示界面

![](https://gitee.com/Kindear/BlogAssets/raw/master/cnblogs/20200301202142.png)


3.详情展示页

![](https://gitee.com/Kindear/BlogAssets/raw/master/cnblogs/20200301202250.png)


> 4.项目关键问题

1. 获取用户信息授权

我是在点击发布的图片按钮处做的处理

~~~vue
 <button
  open-type="getUserInfo"
  bindgetuserinfo="topub">
    <image class="add_icon" src="../../images/add.png"></image>
</button>
~~~

~~~js
topub(e){
    if (e.detail.errMsg == "getUserInfo:ok") {
      console.log('获得授权成功')
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('wxuserinfo', e.detail.userInfo)
      //console.log(e.detail.userInfo)
      wx.navigateTo({
        url: 'SocialCirclePub/SocialCirclePub',
      })
    } else {
      console.log('获得授权失败')
    }
    
  }
~~~

2. 点赞评论数目增加处理

通过云函数解决 inc 解决

~~~js
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  var opr = event.opr;
  if(opr == 'incthumb'){
    try{
      return db.collection('circles_list').doc(event.id).update({
        data:{
          thumbsnum:_.inc(1)
        }
      })
    }catch(e){
      console.error(e)
    }
  }else if (opr == 'incremark') {
    try {
      return db.collection('circles_list').doc(event.id).update({
        data: {
          remarksnum: _.inc(1)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}
