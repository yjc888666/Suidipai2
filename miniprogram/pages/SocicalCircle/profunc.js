const psets = require('../../_self/application.js'); //判端是否是进行云开发
const timeutil = require('../../utils/TimeUtil.js');
const db = wx.cloud.database();
const app = getApp();
/**这是社交圈查询部分 */
function QueryCircleInfo(skipstep){
  return new Promise(function(resolve,reject){
    db.collection('circles_list').skip(skipstep).orderBy('update_time', 'desc').get({
      success(res){
        resolve(res)
      },fail(res){
        reject('request fail')
      }
    })
  })
}

module.exports = {

  QueryCircleInfo: QueryCircleInfo
}