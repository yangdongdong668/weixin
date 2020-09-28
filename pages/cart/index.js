// pages/cart/index.js
import {getSetting, chooseAddress, openSetting,showModal,showToast} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked: false,
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address") || {};
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({address})
    this.setCart(cart);
  },
  // 点击收货地址
  async handleChooseAddress(){
    try{
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断 权限状态
      if(scopeAddress === false){
        await openSetting();
      }
      // 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 存入到缓存中
      wx.setStorageSync("address", address);

    } catch(err){
      console.log(err)
    }
  },
  //商品的选中
  handleItemChange(e){
    console.log(e)
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart}  = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  //商品数量的的编辑功能
  async handleItemNumEdit(e){
    // 获取传递过来的数据
    let {operation,id} = e.currentTarget.dataset;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === id)
    // 判断是否执行删除
    if(cart[index].num ===1 && operation=== -1){
      // 弹窗提示
      const res = await showModal({content: "您是否要删除？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else {
      // 进行修改数量
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 商品全选功能
  handleItemAllCheck(){
    // 获取data中的数据
    let {cart,allChecked} = this.data;
    // 修改数据
    allChecked = !allChecked;
    console.log(allChecked)
    // 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改的数据 填充回data或花缓存中
    this.setCart(cart);

  },

  // 设置购物车状态时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num *v.goods_price;
        totalNum += v.num;
      }else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length !==0 ? allChecked :false;
    this.setData({
      cart,totalPrice,totalNum,allChecked
    });
    wx.setStorageSync("cart",cart)
  },

  // 点击 结算
  async handlePay(){
    const {address,totalNum} = this.data;
    // 判断收货地址
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'});
      return;
    }
    // 判断用户有没有选择商品
    if(totalNum===0){
      await showToast({title:'您还没有选择商品'});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }

  
})