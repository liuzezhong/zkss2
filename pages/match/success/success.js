// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    register_id : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var register_id = options.register_id;
    this.setData({
      register_id : register_id,
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
  
  goBack: function () {
    wx.switchTab({
      'url' : '/pages/match/index/index',
    });
  },

  goRegister: function () {
    console.log(this.data.register_id);
    wx.navigateTo({
      url: '/pages/mine/enrol/enrol?register_id=' + this.data.register_id,
    })
  }
})