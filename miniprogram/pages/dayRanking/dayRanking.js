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
  onLoad: function () {
    console.log('=========onLoad============');
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
    // 获取当天抽取数据
    call.getData('/ranking/day', this.successDay, this.fail);
  },
  successDay: function(data) {
    var that = this;
    that.setData({
      xiaojueding: data.data
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