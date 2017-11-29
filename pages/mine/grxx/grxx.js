// pages/mine/grxx/grxx.js
import $ from '../../../common/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    register_new : {},
    register_complete : {},
    teams : {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    console.log('************onshow');
    var that = this;
    $.post(
      'index.php?m=weapp&c=wxuser&a=getUserInfo',
      {
        sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
      },
      function (res) {
        console.log(res.data);
        if(res.data.status == 1) {
          that.setData({
            'userInfo': res.data.userInfo,
            'teams': res.data.teams,
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
  
  },

  checkUserInfo: function () {
    wx.navigateTo({
      url : '../edituser/edituser'
    });
  },

  createTeam: function () {
    wx.navigateTo({
      url: '../team/team',
    })
  },

  teamInfo: function (e) {
    var team_id = e.currentTarget.dataset.team_id;
    wx.navigateTo({
      url: '../team/team?team_id='+team_id,
    })
  }
})