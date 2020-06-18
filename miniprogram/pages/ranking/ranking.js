// pages/list/list.js
var util = require('../../utils/util.js')
var call = require("../../utils/api.js")

var app = getApp()
Page({
  data: {
    xiaojueding: [],
    myxiaojueding: [],
    
    tab_index: 2,
  },

  onLoad: function (options) {

  },

  //热门、个人小决定
  tabSwitch(e) {
    var that = this, flg = e.currentTarget.dataset.flg, myJuedin = wx.getStorageSync('myJuedin');
    if (flg == 2) {
      that.setData({
        myxiaojueding: myJuedin
      })
    }
    that.setData({
      tab_index: flg == 1 ? '1' : '2'
    })
  },


  //个人决定右边的图片
  personalQToControl(e) {
    var that = this, index = e.currentTarget.dataset.index, idx, myxiaojueding = that.data.myxiaojueding;
    for (let x in myxiaojueding) {
      if (x == index) {
        idx = myxiaojueding[x].num1 == undefined ? index : undefined;
        myxiaojueding[x].num1 = idx;
      } else {
        myxiaojueding[x].num1 = undefined;
      }
    }
    that.setData({
      myxiaojueding: myxiaojueding
    })
  },

  //热门决定右边的图片
  officialQToControl(e) {
    var that = this, index = e.currentTarget.dataset.index, idx;
    for (let x in this.data.xiaojueding) {
      if (x == index) {
        idx = this.data.xiaojueding[x].num == undefined ? index : undefined;
        this.data.xiaojueding[x].num = idx;
      } else {
        this.data.xiaojueding[x].num = undefined;
      }
    }
    that.setData({
      xiaojueding: this.data.xiaojueding
    })
  },
  // 
  successList: function(data) {
    var that = this;
    that.setData({
      ranKingList: data.data
    })
  },
  // 异步请求失败调用
  fail: function () {
    wx.showToast({
      title: '服务器繁忙',
      icon: 'loading',
      mask: false,
      success: function () {
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1500)
      }
    })
  },
  onShow: function () {
    console.log('=========onShow============');
    var that = this, myJuedin = wx.getStorageSync('myJuedin');
    // 发送异步请求
    call.getData('/ranking/list', this.shuffleSuc, this.fail);
    // 获取当天抽取数据
    call.getData('/ranking/day', this.successDay, this.fail);

    app.globalData.defaultJueding = false, app.globalData.myJueding = false;
    wx.removeStorageSync('switchTab')
  },
  // 异步成功调用函数
  shuffleSuc: function(data) {
    var that = this;
    that.setData({
      xiaojueding: data.data
    })
  },
  successDay: function(data) {
    var that = this;
    that.setData({
      myxiaojueding: data.data
    })
    console.log(data.data);
  },
   // 异步请求失败调用
  fail: function () {
    wx.showToast({
      title: '服务器繁忙',
      icon: 'loading',
      mask: false,
      success: function () {
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1500)
      }
    })
  }
})