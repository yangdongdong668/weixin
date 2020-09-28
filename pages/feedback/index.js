// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    textVal:""
  },
  // 外网的图片路径数组
  UpLoadImgs:[],
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击 ”+“ 选择图片
  handleChooseImg(){
    // 调取小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original','compressed'],
      //图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result)
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },
  // 点击自定义组件
  handleRemoveImg(e){
    // 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域的 输入事件
  handleTextInput(e){
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit(){
    // 获取文本域的内容 图片数组
    const {textVal,chooseImgs} = this.data;
    // 合法性验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 准备上传图片 到专门的图片服务器
    // 上传的图片 api 不支持 多个文件同时上传 遍历数组 挨个上传
    // 显示正在上传的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    // 判断有么有需要上传的图片数组

    if(chooseImgs.length != 0){
      chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        //图片上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的文件的路径
          filePath: v,
          name: "file",
          // 顺带的信息
          formData: {},
          success: (result)=>{
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url)
            // 所有的图片都上传完毕了才触发
            if(i === chooseImgs.length -1){
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中")
              // 提交成功了
              // 重置页面
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }else {
      wx.hideLoading();
      console.log("只是提交了文本")
      wx.navigateBack({
        delta: 1
      });
    }
  }


})