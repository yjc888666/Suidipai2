// 云函数入口文件
const cloud = require('wx-server-sdk')
var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;


cloud.init()

// 设置APPID/AK/SK
var APP_ID = "19730607";
var API_KEY = "1iQFxFySTtzDfyWr0EG6G404";
var SECRET_KEY = "aK0G7vcChoEUhfyuocztg4Kv0CaaEwPB";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);

// 如果有可选参数
var options = {};
options["baike_num"] = "5";

// 云函数入口函数
exports.main = async (event, context) => {
  let animal = await aiAnimal()
  console.log(animal)
  return {
    animal
  }

  // 调用函数
  // event.img的图片必须是base64编码的
  function aiAnimal() {
    return new Promise((resolve, reject) => {
      client.animalDetect(event.img, options)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
}