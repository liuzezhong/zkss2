// pages/sign/sign.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    match_id: 0,
    category_id: 0,
    is_register: 0, //是否已经报名
    userInfo: {},
    match: {},
    category: {},
    out_trade_no: 'forfree',
    register: {},
    category_type: 0,
    userTeam: {},
    checkTeamID : 0,
    teamInfo: {},
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkTeamID : e.detail.value,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var match_id = options.match_id;
    var category_id = options.category_id;
    var category_type = options.category_type;
    this.setData({
      'match_id': match_id,
      'category_id': category_id,
      'category_type': category_type,
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
    // 根据比赛ID获取比赛信息和图片信息
    $.post('index.php?m=Weapp&c=match&a=getSignInfo',
      {
        match_id: this.data.match_id,
        category_id: this.data.category_id,
        sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
      },
      function (res) {
        // 数据赋值到data
        console.log(res.data);
        that.setData({
          userInfo: res.data.userInfo,
          match: res.data.match,
          category: res.data.category,
          is_register: res.data.is_register,
          register: res.data.register,
          userTeam: res.data.userTeam,
          teamInfo: res.data.teamInfo,
        });

        if (res.data.userTeam) {
          that.setData({
            checkTeamID: res.data.userTeam[0].team_id,
          });

        }
      }
    );

    console.log('报名类型：' + that.data.category_type);
    console.log('是否已经报名' + that.data.is_register);
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
   * 用户点击立即报名按钮
   */
  signIn: function () {
    var that = this;
    var checkTeamID = this.data.checkTeamID;
    console.log(checkTeamID);
    var postData = {
      sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
      total_fee: this.data.category.money * 100,
      //total_fee: 0.01 * 100,
      body: '中铠街区-' + this.data.match.match_title + '报名费',
      match_id: that.data.match_id,
      category_id: that.data.category_id,
      user_id: that.data.userInfo.user_id,
    };
    if (this.data.category.money != '0.00') {
      // 不是免费
      // 获取微信支付基本参数
      $.post('/index.php?m=weapp&c=match&a=getWxRequestPayment', postData, function (res) {
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.message,
            icon: 'loading',
          })
        } else {
          var requestPayment = res.data.requestPayment;
          that.setData({
            out_trade_no: requestPayment.out_trade_no,
          });
          wx.requestPayment({
            'timeStamp': requestPayment.timeStamp.toString(),
            'nonceStr': requestPayment.nonceStr,
            'package': requestPayment.packages,
            'paySign': requestPayment.paySign,
            'signType': 'MD5',
            'success': function (res) {
              // 支付成功，写报名信息和微信支付记录信息
              $.post('/index.php?m=weapp&c=match&a=createRegisterAndPayrecords',
                {
                  match_id: that.data.match_id,
                  category_id: that.data.category_id,
                  user_id: that.data.userInfo.user_id,
                  checkTeamID: checkTeamID,
                  category_type: that.data.category_type,
                  total_fee: that.data.category.money,
                  out_trade_no: that.data.out_trade_no,
                  remark: '中铠街区-' + that.data.match.match_title + '报名费',
                }, function (res) {
                  // 写入成功后，跳转报名成功页面
                  console.log(res.data.message);
                  wx.redirectTo({
                    url: '/pages/match/success/success?register_id=' + res.data.register_id,
                  });
                });
            },
            'fail': function (res) {
              // 支付失败
              console.log(res);
            }
          })

        }
      });

    } else {
      // 免费得
      // 支付成功，写报名信息和微信支付记录信息
      $.post('/index.php?m=weapp&c=match&a=createRegisterAndPayrecords',
        {
          match_id: that.data.match_id,
          category_id: that.data.category_id,
          user_id: that.data.userInfo.user_id,
          checkTeamID: checkTeamID,
          category_type: that.data.category_type,
          total_fee: that.data.category.money,
          out_trade_no: that.data.out_trade_no,
          remark: '中铠街区-' + that.data.match.match_title + '报名费',
        }, function (res) {
          // 写入成功后，跳转报名成功页面
          console.log(res.data);
          wx.redirectTo({
            url: '/pages/match/success/success?register_id=' + res.data.register_id,
          });
        });
    }

  },

  /**
   * 查看团队信息详情
   */
  teamInfo: function (e) {

    var team_id = e.currentTarget.dataset.team_id;
    console.log(team_id);
    wx.navigateTo({
      url: '/pages/mine/team/team?team_id=' + team_id + '&is_info=1',
    })
  },
})