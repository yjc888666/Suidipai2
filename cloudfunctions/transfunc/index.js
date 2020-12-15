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