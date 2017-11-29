//index.js
//获取应用实例
import $ from '../../../common/common.js';
Page({
  data: {
    matchList : {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  
  detail: function(e) {
    var match_id = e.currentTarget.dataset.matchid;
    console.log('detail matchiid');
    console.log(match_id);
    wx.navigateTo({
      url: '/pages/match/detail/detail?match_id=' + match_id,
    })
  },

  onShow: function () {
    var that = this;
    // 获取所有未结束的比赛信息记录
    $.post('index.php?m=Weapp&c=match&a=listAllMatchInfoUnfinished', {}, function (res) {
      if (res.data.status == 1) {
        // 输出状态信息
        console.log(res.data.message);
        // 赋值到data数据里
        that.setData({
          'matchList': res.data.matchs,
        });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    // 获取所有未结束的比赛信息记录
    $.post('index.php?m=Weapp&c=match&a=listAllMatchInfoUnfinished', {}, function (res) {
      if (res.data.status == 1) {
        // 输出状态信息
        console.log(res.data.message);
        // 赋值到data数据里
        that.setData({
          'matchList': res.data.matchs,
        });
      }
    });
  },
})


