// pages/rank/rank.js
import $ from '../../common/common.js';
var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs: ["30天运动步数", "群排行榜", "身价排行",],
    tabs: ["30天运动步数", "身价排行",],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    user: {},
    userStepList: {},
    userWorthList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSetting({
      success: res => {
        console.log('wx.getSetting接口调用成功');
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 获取微信过去三十天运动步数
          wx.getWeRunData({
            success(res) {
              // 加密结果
              const encryptedData = res.encryptedData;
              const iv = res.iv;
              // 前往服务端解密
              $.post(
                'index.php?m=weapp&c=rank&a=decEnData',
                {
                  encryptedData: encryptedData,
                  iv: iv,
                  sessionKey: wx.getStorageSync('sessionKey'),
                },
                function (res) {
                  if (res.data.status == 0) {
                    wx.showToast({
                      title: res.data.message,
                    })
                  } else {
                    that.onShow();
                  }
                }
              );
            }
          })
        } else {
          console.log('未授权');
          wx.getUserInfo({
            success: function (res) {
              console.log('****************');
              console.log(getApp().globalData.userInfo);
              getApp().globalData.userInfo = res.userInfo;
              console.log(getApp().globalData.userInfo);
              console.log('****************');
              // 将用户信息保存到数据库
              $.post('index.php?m=weapp&c=wxuser&a=saveWxUserInfo', {
                sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
                userInfo: JSON.stringify(res.userInfo)
              }, function (res) {
                console.log(res.data.message);

                // 获取微信过去三十天运动步数
                wx.getWeRunData({
                  success(res) {
                    // 加密结果
                    const encryptedData = res.encryptedData;
                    const iv = res.iv;
                    // 前往服务端解密
                    $.post(
                      'index.php?m=weapp&c=rank&a=decEnData',
                      {
                        encryptedData: encryptedData,
                        iv: iv,
                        sessionKey: wx.getStorageSync('sessionKey'),
                      },
                      function (res) {
                        if (res.data.status == 0) {
                          wx.showToast({
                            title: res.data.message,
                          })
                        }else {
                          that.onShow();
                        }
                      }
                    );
                  }
                })



              }
              );
            }
          })
        }
      },
      fail: res => {
        console.log('wx.getSetting接口调用失败');
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

    // if (!that.data.hasUserInfo && that.data.canIUse) {
    //   // 微信登录
    //   wx.getUserInfo({
    //     success: function (res) {
    //       that.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })

    //       // 将用户信息保存到数据库
    //       $.post('index.php?m=weapp&c=wxuser&a=saveWxUserInfo', {
    //         sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
    //         userInfo: JSON.stringify(res.userInfo)
    //       }, function (res) {
    //         console.log(res.data.message);
    //       }
    //       );
    //     }
    //   })
    // }

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
      'index.php?m=weapp&c=rank&a=getRankList',
      {
        sessionKey: wx.getStorageSync('sessionKey'),
      },
      function (res) {
        console.log(res);
        if (res.data.status == 1) {
          that.setData({
            user: res.data.user,
            userStepList: res.data.userStepList,
            userWorthList: res.data.userWorthList,
          });
        } else if (res.data.status == 0) {
          wx.showToast({
            title: res.data.message,
          })
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