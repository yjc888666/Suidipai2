const psets = require('../../../_self/application.js'); //判端是否是进行云开发
const timeutil = require('../../../utils/TimeUtil.js');
const cloudpath = 'circle';
const db = wx.cloud.database();
const app = getApp();
/** 数据上传服务 */
function UpCircleInfo(_res) {
  var that = this;
  return new Promise(function (resolve, reject) {
    if (psets.CloudSetting.UseCloud) { //使用云开发
      wx.cloud.getTempFileURL({
        fileList: _res.realList,
        success(res){
          var turls = [];
          for (var i = 0; i < res.fileList.length; i++) {
            turls.push(res.fileList[i].tempFileURL);
          }
          var timer = setInterval(function () {
            if (res.fileList.length == turls.length) {
              // 等待遍历 执行完毕
              clearInterval(timer);
              wx.cloud.callFunction({
                name: 'clouddb',
                data: {
                  opr: 'add',
                  tablename: 'circles_list',
                  data: {
                    create_time: timeutil.TimeCode(new Date()),
                    update_time: timeutil.TimeCode(new Date()),
                    content: _res.content,
                    images: turls,
                    userid: app.globalData.openid,
                    thumbsnum: 0,
                    remarksnum: 0,
                    nickname: _res.userinfo.nickName,
                    avatar: _res.userinfo.avatarUrl,
                  }
                },
                success(res) {
                  resolve(res)
                }, fail(res) {
                  reject('request fail')
                }
              })
            }
          }, 1000)
        }
      })
      
    } else {
      //不使用云开发
    }
  })
}
/** 文件上传两者分开写，区别有些大 */
function UploadImage(path) {
  var that = this;
  return new Promise(function (resolve, reject) {
    if (psets.CloudSetting.UseCloud) {
      //使用云开发
      that.CloudUploadImage(path).then(function (res) {
        resolve(res);
      })
    } else {
      //不使用云开发
      that.EcsUploadImage(path).then(function (res) {
        resolve(res);
      })
    }
  })
}
function EcsUploadImage(path) {

}
function CloudUploadImage(path) {
  // 本地文件路径
  return new Promise(function (resolve, reject) {
    wx.getFileInfo({
      filePath: path,
      success(ans) {
        wx.cloud.uploadFile({
          cloudPath: cloudpath + '/' + ans.digest + '.png',
          filePath: path,
          success: res => {
            resolve(res)
          },
          fail(res) {
            reject('upload fail')
          }
        })
      }
    })
  })
}
module.exports = {
  UploadImage: UploadImage,
  CloudUploadImage: CloudUploadImage,
  EcsUploadImage: EcsUploadImage,
  UpCircleInfo: UpCircleInfo
}