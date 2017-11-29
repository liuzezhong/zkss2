// pages/mine/edituser/edituser.js
import $ from '../../../common/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArray : ['请选择性别','男','女'],
    sexIndex : 0,
    userInfo : {},
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
    var that = this;
    $.post(
      'index.php?m=weapp&c=wxuser&a=getUserInfo',
      {
        sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
      },
      function (res) {
        console.log(res);
        if (res.data.status == 1) {
          that.setData({
            'userInfo': res.data.userInfo,
          });
          if (res.data.userInfo.real_sex != null) {
            that.setData({
              'sexIndex': res.data.userInfo.real_sex,
            });
          }
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

  bindSexPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },

  formSubmit: function (e) {
    var formValue = e.detail.value;
    if(formValue.real_name == '' || !formValue.real_name) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'loading',
        duration: 2000
      })
    } else if (formValue.id_card == '' || !formValue.id_card) {
      wx.showToast({
        title: '请输入身份证号码',
        icon: 'loading',
        duration: 2000
      })
    } else if (formValue.real_sex == 0) {
      wx.showToast({
        title: '请选择性别',
        icon: 'loading',
        duration: 2000
      })
    } else if (formValue.phone_number == '' || !formValue.phone_number) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'loading',
        duration: 2000
      })
    } else {
      console.log('form携带数据完整：', e.detail.value);
      $.post('index.php?m=weapp&c=wxuser&a=saveWxUserInfo', {
        sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
        userInfo: JSON.stringify(formValue)
      }, function (res) {
        console.log(res.data.message);
        wx.navigateBack({
          delta:1,
        })
      }
      );
    }
  },
})