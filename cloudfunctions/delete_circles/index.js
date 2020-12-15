// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const_=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //这里的update依据是event._id   
    return await db.collection("circles_list").doc(event._id).remove()
  }
  catch (e) {
    console.error(e)
  }
}