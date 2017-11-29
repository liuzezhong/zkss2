// pages/mine/team/team.js
import $ from '../../../common/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team_id: 0,
    is_info: 0, //是否只显示信息 0为否，1为是
    member: 1,
    memberArray: [1],
    sexArray: ['请选择性别', '男', '女'],
    sexIndex: 0,
    sexIndexArray: ['0'],
    teamInfo: {},
    newTeamUser: {},
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.team_id) {
      this.setData({
        team_id: options.team_id,
      });
    }
    if (options.is_info) {
      this.setData({
        is_info: options.is_info,
        disabled: true,
      });
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
    if(this.data.team_id != 0) {
      $.post(
        'index.php?m=weapp&c=wxuser&a=getTeamInfo',
        {
          team_id: this.data.team_id,
        },
        function (res) {
          console.log(res.data);
          if (res.data.status == 1) {
            that.setData({
              teamInfo: res.data.teamInfo,
              sexIndex: res.data.teamInfo.leader.real_sex,
              member: res.data.memberNumber,
              memberArray: res.data.memberArray,
              newTeamUser: res.data.newTeamUser,
              sexIndexArray: res.data.sexIndexArray,
            });
          } else {
            console.log(res.data.message);
          }
        }
      );
    }
    
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

  addMember: function (e) {
    var member = this.data.member;
    var memberArray = this.data.memberArray;
    var sexIndexArray = this.data.sexIndexArray;

    member++;
    memberArray.push(member);
    sexIndexArray.push('0');

    this.setData({
      member: member,
      memberArray: memberArray,
      sexIndexArray: sexIndexArray,
    });
  },

  /**
   * 用户点击保存按钮
   */
  formSubmit: function (e) {
    console.log(e.detail.value);
    var formValue = e.detail.value;
    var memberArray = this.data.memberArray;
    var flag = 1;
    if (formValue.team_name == '' || formValue.team_name == null) {
      wx.showToast({
        title: '请输入团队名称',
      })
    } else if (formValue.leader_name == '' || formValue.leader_name == null) {
      wx.showToast({
        title: '请输入队长姓名',
      })
    } else if (formValue.leader_idcard == '' || formValue.leader_idcard == null) {
      wx.showToast({
        title: '请输入队长身份证号',
      })
    } else if (formValue.leader_sex == 0) {
      wx.showToast({
        title: '请选择队长性别',
      })
    } else if (formValue.leader_phone == '' || formValue.leader_phone == null) {
      wx.showToast({
        title: '请输入队长手机号码',
      })
    } else {
      for (var i = 0; i < memberArray.length; i++) {
        var t = memberArray[i];
        if (formValue['real_name' + t] == '' || formValue['real_name' + t] == null) {
          wx.showToast({
            title: '请填写队员姓名',
          })
          flag = 0;
          break;
        } else if (formValue['id_card' + t] == '' || formValue['id_card' + t] == null) {
          wx.showToast({
            title: '请填写队员身份证号码',
          })
          flag = 0;
          break;
        } else if (formValue['real_sex' + t] == 0) {
          wx.showToast({
            title: '请选择队员性别',
          })
          flag = 0;
          break;
        } else if (formValue['phone_number' + t] == '' || formValue['phone_number' + t] == null) {
          wx.showToast({
            title: '请输入队员手机号码',
          })
          flag = 0;
          break;
        }
      }
      if (flag == 1) {
        $.post(
          'index.php?m=weapp&c=wxuser&a=createTeam',
          {
            sessionKey: JSON.stringify(wx.getStorageSync('sessionKey')),
            formArray: JSON.stringify(e.detail.value),
            team_id: this.data.team_id,
          },
          function (res) {
            console.log(res.data);
            if (res.data.status == 1) {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              wx.showToast({
                title: res.data.message,
              })
            }
          }
        );
      }
    }

  },

  /**
   * 更改队员的性别
   */
  bindMemberSexPickerChange: function (e) {
    var item = e.currentTarget.dataset.item;
    var sexIndexArray = this.data.sexIndexArray;
    sexIndexArray[item-1] = e.detail.value;
    this.setData({
      sexIndexArray: sexIndexArray,
    })
  },

  /**
   * 更改队长的性别
   */
  bindleaderSexPickerChange: function (e) {
    this.setData({
      sexIndex: e.detail.value,
    })
  },
})