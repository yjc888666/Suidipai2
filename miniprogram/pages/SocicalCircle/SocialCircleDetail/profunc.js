const psets = require('../../../_self/application.js'); //判端是否是进行云开发
const timeutil = require('../../../utils/TimeUtil.js');
const db = wx.cloud.database();
const app = getApp();

function AddRemarks(_res) {
  return new Promise(function (resolve, reject) {
    //使用云开发的的方案
    wx.cloud.callFunction({
      name: 'clouddb',
      data: {
        opr: 'add',
        tablename: 'remarks_list',
        data: {
          create_time: timeutil.TimeCode(new Date()),
          update_time: timeutil.TimeCode(new Date()),
          circle_id: _res.circleitem._id,
          nickname: app.globalData.userInfo.nickName,
          avatar: app.globalData.userInfo.avatarUrl,
          content: _res.content,
          userid: app.globalData.openid
        }
      },
      success(res) {
        wx.cloud.callFunction({
          name: 'transfunc',
          data: {
            opr: 'incremark',
            id: _res.circleitem._id
          },
          success(ans) {
            resolve(ans)
          },
          fail(ans) {
            reject('call fail')
          }
        })

      }
    })
    //下面是非云开发方案

  })
}

function AddThumbs(_res) {
  return new Promise(function(resolve,reject){
    wx.cloud.callFunction({
      name: 'clouddb',
      data: {
        opr: 'add',
        tablename: 'thumbs_list',
        data: {
          create_time: timeutil.TimeCode(new Date()),
          update_time: timeutil.TimeCode(new Date()),
          userid: app.globalData.openid,
          circle_id: _res.circleitem._id,
        }
      },
      success(res) {
        resolve(res);
        // 请求自增
        wx.cloud.callFunction({
          name: 'transfunc',
          data: {
            opr: 'incthumb',
            id: _res.circleitem._id
          }
        })
      }
    })
  })
  
}
module.exports = {
  AddRemarks: AddRemarks,
  AddThumbs: AddThumbs
}