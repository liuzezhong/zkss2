// pages/match/more/more.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    match_id : 0,
    registers : {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var match_id = options.match_id;
    this.setData({
      match_id : match_id,
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
    $.post('index.php?m=weapp&c=register&a=getMatchRegister',
    {
      match_id : this.data.match_id,
    },
    function(res) {
      that.setData({
        registers : res.data.registers,
      });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    $.post('index.php?m=weapp&c=register&a=getMatchRegister',
      {
        match_id: this.data.match_id,
      },
      function (res) {
        that.setData({
          registers: res.data.registers,
        });
      });
  },
})