// pages/mine/enrol/enrol.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    register_id: 0,
    match: {},
    category: {},
    userInfo: {},
    register: {},
    teamInfo: {},
    is_team: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var register_id = options.register_id;
    this.setData({
      register_id: register_id,
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
      'index.php?m=weapp&c=register&a=getRegisterInfo',
      {
        register_id: this.data.register_id,
      },
      function (res) {
        console.log(res.data);
        if (res.data.status == 1) {
          that.setData({
            match: res.data.match,
            category: res.data.category,
            userInfo: res.data.user,
            register: res.data.register,
            teamInfo: res.data.teamInfo,
            is_team: res.data.is_team,
          });
        } else if (res.data.status == 0) {
          console.log(res.data.message);
        }
      }
    );
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