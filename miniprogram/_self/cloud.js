var pset = require('application.js')
function CallCloudFuncAndSetStorge(funcname,insertstorge,storgekey){
  return new Promise(function (resolve, reject){
    wx.cloud.callFunction({
      name: funcname,
      success: res => {
        resolve(res.result.openid)
        if (pset.LogConfig.StorgeLog) { console.log('缓存设置成功,key为:' + storgekey) }
        if (insertstorge) {
          wx.setStorageSync(storgekey, res.result)
        }
      }, fail: res => {
        if (pset.LogConfig.StorgeLog) { console.log('缓存设置失败') }
        reject('callfuncfail')
      }
    })
  })
}
function CallCloudFunc(funcname,data){
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({
      name: funcname,
      data:data,
      success: res => {
        resolve(res)
      }, fail: res => {
        reject('callfuncfail')
      }
    })
  })
}
module.exports = {
  CallCloudFuncAndSetStorge: CallCloudFuncAndSetStorge,
  CallCloudFunc: CallCloudFunc
}