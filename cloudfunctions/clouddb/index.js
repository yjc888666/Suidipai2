// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  //集合数据增加操作
  var opr = event.opr;
  if (opr == 'add') {
    //参数列表: 集合名 上传的数据对象
    try {
      return db.collection(event.tablename).add({
        data: event.data
      })
    } catch (e) {
      console.error(e)
    }
  } else if (opr == 'del') {
    //参数列表: 集合名 删除的元素docid
    // console.log(typeof event.docid == 'undefined')

    //条件删除有一些问题 需要修改测试一下下
    //console.log(event.belongs)
    console.log(event.id)
    try {
      return await db.collection(event.tablename).doc(event.id).remove()
    } catch (e) {
      console.error(e)
    }
  }
  
}