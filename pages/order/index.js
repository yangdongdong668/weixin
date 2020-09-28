// pages/order/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:'全部',
        isActive:true
      },
      {
        id:1,
        value:'待付款',
        isActive:false
      },
      {
        id:2,
        value:'待发货',
        isActive:false
      },
      {
        id:3,
        value:'退款/退货',
        isActive:false
      }
    ],
  },
  onShow(){
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      })
      return 
    }
    // 获取当前的小程序的页面栈-数组  长度最大是10 页面
    let pages =  getCurrentPages();
    // 数组中 索引虽大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    //获取url上的参数
    const {type} = currentPage.options;
    //激活选中页面标题  当 type=1 index = 0
    this.changeTitleByIndex(type-1);
    this.getOrders(type);

    
  },
  //获取订单列表的方法
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data:{type}});
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  // 根据标题索引激活选中 标题数组
  changeTitleByIndex(index){
    //修改源数组
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail
    this.changeTitleByIndex(index)
    //重新发送请求 type = 1 index = 0
    this.getOrders(index +1 )
  },
})