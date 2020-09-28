//引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js"

Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  //页面开始加载的时候就会触发的事件
  onLoad: function(options){
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
  },
  //获取轮播图数据
  getSwiperList(){
    request({
      url:'/home/swiperdata'
    }).then((result)=>{
      const swiperList = result.map((item)=>{
        item.navigator_url = item.navigator_url.replace(/main/g,"index")
        return item
      })
      this.setData({
        swiperList
      })
    })
  },
  //获取 分类导航数据
  getCateList(){
    request({
      url:'/home/catitems'
    }).then((result)=>{
      this.setData({
        catesList:result
      })
    })
  },
  //获取 楼层数据
  getFloorList(){
    request({
      url:'/home/floordata'
    }).then((result)=>{
      const floorList = result.map((item)=>{
        item.product_list.forEach(e => {
          e.navigator_url = e.navigator_url.replace(/goods_list/g,"goods_list/index")
        });
        return item
      })
      this.setData({
        floorList
      })
    })
  }

});