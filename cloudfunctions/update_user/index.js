// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = wx.cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {  
     //这里的update依据是event._id   
      return await db.collection("user_table").doc(event._id).update({  
                data:{
                  password: event.password2//密码    
                }
               
                   
                 })  
                 } 
                 catch (e)
                  {   
                     console.error(e) 
      }
}