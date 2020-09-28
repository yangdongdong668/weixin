import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/asyncWx.js"
Page({
  // 获取用户信息
  async handleGetUserInfo(e){
    try{
      // 获取用户信息
      const { encryptedData,rawData,iv,signature } = e.detail;
      // 获取小程序登陆成功后的code
      const {code} = await login()
      console.log(code)

      const loginParams={ encryptedData,rawData,iv,signature,code };
      //发送请求 获取用户的token
      let {token}= await request({url:"/users/wxlogin",data:loginParams,method:"post"}) || {token:' Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'}
     
      // 把token存入缓存中，同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch(error){
      console.log(error)
    }
  }
})