// pages/category/index.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0

  },
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      1 先判断一下本地存储中有没有旧数据
      {time:Date.now(),data:[...]}
      2 没有旧数据 就直接请求
      3 有旧数据 同时 旧数据也没过期 就是用 本地存储中的旧数据
    */
   //获取本地存储中的数据 
   const Cates = wx.getStorageSync("cates");
   if(!Cates){
     // 不存在 发送请求获取数据
    this.getCates();
   }else {
     if(Date.now() - Cates.time > 1000 * 60 *5){
       // 重新发送请求
       this.getCates();
     }else {
       //可以使用旧数据
      this.Cates = Cates.data;
      // 构造左边的大菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      // 构造右侧商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
     }
   }
  },

  //获取分类数据
  async getCates(){
    const res = await request({url:'/categories'})
    this.Cates = res;
    //把接口的数据存入到本地存储
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    // 构造左边的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
    // request({
    //   url:'/categories'
    // }).then((res)=>{
    //   console.log(res);
    //   this.Cates = res.data.message;

    //   //把接口的数据存入到本地存储
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左边的大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
  },
  handleItemTab(e){
    let currentIndex = e.currentTarget.dataset.index;
    let rightContent = this.Cates[currentIndex].children;
    this.setData({
      currentIndex,
      rightContent,
      //重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})