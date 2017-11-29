// pages/mine/wdss/wdss.js
import $ from '../../../common/common.js'
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["即将开赛", "历史参与",],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    var that = this;
    $.post(
      'index.php?m=weapp&c=wxuser&a=listUserMatch',
      {
        sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
      },
      function(res){
        console.log(res.data);
        if(res.data.status == 1) {
          that.setData({
            'register_new': res.data.register_new,
            'register_complete': res.data.register_complete,
          });
        }else {
          console.log(res.data.message);
        }
      });
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
  
  },

  registerDetail: function (e) {
    console.log(e);
    var register_id = e.currentTarget.dataset.register_id;
    wx.navigateTo({
      url: '/pages/mine/enrol/enrol?register_id=' + register_id,
    })
  }
})