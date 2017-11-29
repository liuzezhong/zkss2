// pages/detail/detail.js
import $ from '../../../common/common.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    match_id : 0,
    // 比赛信息
    match : {} ,
    // 比赛图片信息
    images : {},
    // 比赛类目信息
    categoryName : {},
    categoryID : {},
    userInfo: {},
    hasUserInfo: false,
    // 已经报名用户信息
    registerUserInfo : {},
    // 已经报名人数
    countRegister : 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    categoryType: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取上一个页面传递的比赛ID
    var match_id = options.match_id;
    console.log(match_id);
    console.log('onload');
    // 赋值到Data
    this.setData({
      match_id : match_id,
    });

    // 增加查看次数
    $.post('index.php?m=Weapp&c=match&a=increaseViewTimes',
      { match_id: this.data.match_id, },
      function (res) {
        // 输出返回信息
        console.log(res.data.message);
      }
    );

    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
    $.post('index.php?m=Weapp&c=match&a=getMatchInfoByID', 
      { match_id: this.data.match_id, },
        function (res) {
          // 数据赋值到data
          console.log(res.data.categoryType);
          that.setData({
            match : res.data.match,
            images : res.data.images,
            categoryName : res.data.categoryName,
            categoryID : res.data.categoryID,
            registerUserInfo: res.data.registerUserInfo,
            countRegister: res.data.countRegister,
            categoryType: res.data.categoryType,
          });
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
    var that = this;
    // 根据比赛ID获取比赛信息和图片信息
    $.post('index.php?m=Weapp&c=match&a=getMatchInfoByID',
      { match_id: this.data.match_id, },
      function (res) {
        // 数据赋值到data
        console.log(res.data.categoryType);
        that.setData({
          match: res.data.match,
          images: res.data.images,
          categoryName: res.data.categoryName,
          categoryID: res.data.categoryID,
          registerUserInfo: res.data.registerUserInfo,
          countRegister: res.data.countRegister,
          categoryType: res.data.categoryType,
        });
      }
    );
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
    wx.showShareMenu({
      withShareTicket: true
    });
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮');
    }
    return {
      title: '邀请好友一起报名',
      path: '/pages/match/detail/detail?match_id=' + this.data.match_id,
      success: function (res) {

        // //用户+100积分
        // var data = {
        //   skey: JSON.stringify(wx.getStorageSync('skey')),
        //   reward: 10,
        // };
        // $.post('index.php?m=activity&c=user&a=addrankmoney', data, function (res) {
        //   console.log('铠币领取成功');
        // });
      },
      fail: function (res) {
        console.log(res.shareTickets[0]);
      }
    }
  },

  /**
   * 点击我要报名按钮出发picker空间
   */
  bindPickerChange: function (e) {
    // 比赛类目ID
    var category_id = this.data.categoryID[e.detail.value];
    var match_id = this.data.match_id;
    var register_max = this.data.match.register_max;
    var categoryType = this.data.categoryType;
    var pickEventID = e.detail.value;
    if (this.data.hasUserInfo == false) {
      // 如果没有授权信息
      // 提示登陆信息授权
      wx.showToast({
        title: '请先授权登陆',
        icon: 'loading',
        duration: 2000 ,
      })
      setTimeout(function(){
        wx.switchTab({
          url: '../../mine/home/home'
        })
      }, 2000)
      
    }else {
      console.log(categoryType[pickEventID]);
      // 已经授权,判断是个人赛事还是团队赛
      if (categoryType[pickEventID] == 0) {
        console.log(categoryType[pickEventID]);
        // 个人赛，判断是否填写个人信息
        $.post(
          'index.php?m=weapp&c=wxuser&a=getuserinfo',
          {
            sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
          },
          function (res) {
            if (res.data.status == 0) {
              console.log(res.data.message);
            } else {
              // 判断是否完善个人信息
              if (res.data.userInfo.real_name != null && res.data.userInfo.phone_number != null) {
                // 已经完善个人信息

                // 查看报名项数是否超过
                if (register_max == 0) {
                  // 个人报名项目无限制
                  wx.navigateTo({
                    url: '/pages/match/sign/sign?match_id=' + match_id + '&category_id=' + category_id,
                  })
                } else {
                  // 个人报名项目有限制
                  $.post(
                    'index.php?m=weapp&c=register&a=checkRegisterMax',
                    {
                      sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
                      match_id: match_id,
                      category_id: category_id,
                    },
                    function (res) {
                      if (res.data.status == 1) {
                        // 单人最大报名项目已经超过，提示错误信息
                        wx.showToast({
                          title: '每人只可报' + register_max + '项',
                          icon: 'loading',
                          duration: 2000,
                        })
                      } else {
                        // 未超过
                        wx.navigateTo({
                          url: '/pages/match/sign/sign?match_id=' + match_id + '&category_id=' + category_id + '&category_type=' + categoryType[pickEventID],
                        })
                      }
                    });
                }
              } else {
                // 未完善个人信息
                wx.showToast({
                  title: '请完善个人信息',
                  icon: 'loading',
                  duration: 2000,
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/mine/edituser/edituser',
                  })
                }, 2000)
              }
            }
          });
      } else if (categoryType[pickEventID] == 1) {
        // 团队赛，判断是否填写团队信息
        console.log(categoryType[pickEventID]);
        $.post(
          'index.php?m=weapp&c=wxuser&a=getUserTeam',
          {
            sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
          },
          function (res) {
            
            if(res.data.status == 1) {
              // 用户已经创建团队
              wx.navigateTo({
                url: '/pages/match/sign/sign?match_id=' + match_id + '&category_id=' + category_id + '&category_type=' 
                    + categoryType[pickEventID],
              })
            } else if (res.data.status == 0) {
              console.log(res.data.message);
              // 未完善个人信息
              wx.showToast({
                title: '请先创建团队',
                icon: 'loading',
                duration: 2000,
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/mine/team/team',
                })
              }, 2000)
            }
          });
      }
      
      
    }
  },

  moreRegister: function(e) {
    var match_id = e.currentTarget.dataset.match_id;
    wx.navigateTo({
      url: '../more/more?match_id=' + match_id,
    })
  }
})