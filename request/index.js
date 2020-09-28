
//同时发送异步代码次数
let ajaxTime = 0
export const request = (params)=>{
  // 判断 url 中是否带有 /my/ 请求的是私有的路径 带上 header token
  let header = {...params.header};
  if(params.url.includes("/my/")){
    // 拼接 header 带上 token
    header["Authorization"] = wx.getStorageSync("token");
  }

  ajaxTime++;
  //显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  // 定义公共的url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success: (result)=>{
        resolve(result.data.message)
      },
      fail: (err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTime--
        if(ajaxTime===0){
          // 隐藏加载中
          wx.hideLoading()
        }
      }

    });
  })
}