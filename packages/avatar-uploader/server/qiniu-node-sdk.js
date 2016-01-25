// 引入七牛 node.js SDK
QiniuNodeSDK = Npm.require('qiniu');

// 创建上传策略：服务端上传
/* ==================++++填写下面三个参数++++=================*/
var ak = 't4pj7Tv2M08Uk57DsDHCJxAezc8wYym59_aBVw1S';
var sk = '_ZIml1eyHQ1oDQFiAwTjjacYfCO4IRMVeBEGF2pS';
var bucketname = 'com-92hackers-avatar';


QiniuNodeSDK.conf.SECRET_KEY = sk;
QiniuNodeSDK.conf.ACCESS_KEY = ak;
var putPolicy = new QiniuNodeSDK.rs.PutPolicy(bucketname);

// 转换异步接口为同步

var qiniuClient = new QiniuNodeSDK.rs.Client();
var wrappedQiniuIo = Async.wrap(QiniuNodeSDK.io, ['put']);
var wrappedQiniuClient = Async.wrap(qiniuClient, ['stat', 'remove', 'copy', 'move']); //获取基本信息，移动...

// 上传二进制头像文件
function uploadAvatarBuf(avatarBuf) {
  var uptoken = putPolicy.token();
  var extra = new QiniuNodeSDK.io.PutExtra();
  extra.mimeType = 'image/jpeg';
  return wrappedQiniuIo.put(uptoken, '', avatarBuf, extra);
}




Meteor.methods({
  // 接收头像信息，base64 格式
  'sendAvatarInBase64': function(avatarBuf, userId) {
    if (!this.userId) {
      return {
        code: -1,
        msg: '非登录用户，无法上传头像'
      }
    }

    var res = uploadAvatarBuf(new Buffer(avatarBuf.replace(/^data:image\/\w+;base64,/, ""), 'base64'));
    if (res.key) {
      Meteor.defer(function () {
        // 当前线上头像
        var currentKey;
        var user = Meteor.users.findOne({_id: userId});
        if (user) {
          currentKey = user.profile.avatar
        }
        // 更新头像
        var updateRes = Meteor.users.update({'_id': userId}, {'$set': {'profile.avatar': res.key}});
        if (updateRes === 1) {
          if (currentKey) {
            // 更新成功，删除当前的头像
            wrappedQiniuClient.remove(bucketname, currentKey);
          }
        }
      });
      return {
        code: 0,
        msg: "图片上传成功"
      }
    } else {
      return {
        code: -1,
        msg: '图片上传失败，请重试'
      }
    }
  }
});
