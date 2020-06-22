// pages/list/list.js
var util = require('../../utils/util.js')
var call = require("../../utils/api.js")
var xiaojueding = []
var app = getApp()
Page({
    data: {
      xiaojueding: [],
      myxiaojueding: [],
      tab_index: 2,
    },
   //收藏
    officialQToKeep(e) {
      var that = this, index = e.currentTarget.dataset.index, myJuedin = wx.getStorageSync('myJuedin'), xiaojueding = that.data.xiaojueding, flag = true;
      myJuedin = util.isNull(myJuedin) ? [] : myJuedin;
      for (let x in xiaojueding) {
         if (x == index) {
            if (myJuedin.length == 0) {
               myJuedin.push(xiaojueding[x]);
               wx.setStorageSync('myJuedin', myJuedin);
               wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                  mask: false
               })
            } else {
               for (let i in myJuedin) {
                  if (myJuedin[i].id == xiaojueding[x].id) {
                     flag = false;
                     break;
                  }
               }
               if (flag) {
                  myJuedin.push(xiaojueding[x]);
                  wx.setStorageSync('myJuedin', myJuedin);
                  wx.showToast({
                     title: '收藏成功',
                     icon: 'success',
                     mask: false
                  })
               }
            }
            break;
         }
      }
      that.setData({
         xiaojueding: xiaojueding
      })
   },

   //删除
   personalQToDelete(e) {
      var that = this, index = e.currentTarget.dataset.index, myJuedin = that.data.xiaojueding;
      for (let i in myJuedin) { 
         if (i == index) {
            call.paramPost("/turntable/delete",
            {
               id: myJuedin[i].id
            }, this.delSuccess, this.fail)
            break;
         }
      }
   },
   // 加载数据
   getData(){
       call.getData('/turntable/treeList', this.shuffleSuc, this.fail);
   },
  delSuccess:function(data){
   var self = this;
   if(data.code == "20000") {
     wx.showToast({
       title: '删除成功',
       icon: 'success',
       mask: false,
       success: function () {
         self.getData();
       }
     })
   }
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

   //添加个人小决定
   addPersonalQ(e) {
      wx.navigateTo({
         url: '../save/save?flg=2',
      })
   },

   //个人编辑
   personalQToRevise(e) {
      var that = this, myJuedin = that.data.xiaojueding, index = e.currentTarget.dataset.index;
      for (let i in myJuedin) {
         if (i == index) {
            wx.navigateTo({
               url: '../edit/edit?flg=1&item=' + JSON.stringify(myJuedin[i])
            })
            return;
         }
      }
   },

   //热门编辑
   officialQToRevise(e) {
      var that = this, xiaojueding = that.data.xiaojueding, index = e.currentTarget.dataset.index;
      for (let i in xiaojueding) {
         if (i == index) {
            wx.navigateTo({
               url: '../edit/edit?flg=1&item=' + JSON.stringify(xiaojueding[i])
            })
            return;
         }
      }
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
      console.log(this.data.xiaojueding)
   },


   //热门决定的标题
   officialQToRun(e) {
      var that = this, id = e.currentTarget.dataset.id;
      app.globalData.defaultJueding = true;
      id = id == 0 ? '00' : id;
      wx.setStorageSync('switchTab', id);
      wx.switchTab({
         url: '../index/index'
      })
   },

   /**
    * 个人决定的标题
    * @param {*} e 
    */
   personalQToRun(e) {
      var that = this, id = e.currentTarget.dataset.id;
      app.globalData.defaultJueding = true;
      wx.setStorageSync('switchTab', id);
      wx.switchTab({
         url: '../index/index'
      })
   },
   onLoad: function(){
      console.log('=========onLoad============');
   },
   onShow: function () {
      console.log('=========onShow============');
      this.getData();
      var that = this, myJuedin = wx.getStorageSync('myJuedin');     
      app.globalData.defaultJueding = false, app.globalData.myJueding = false;
      //创建的个人小决定
      if (!util.isNull(myJuedin)) {
         that.setData({
            myxiaojueding: myJuedin
         })
      }
      wx.removeStorageSync('switchTab')
  },
  /**
   * 异步请求成功调用
   * @param {*} data 响应结果集
   */
  shuffleSuc: function (data) {
    var that = this;
    console.log(data);
    that.setData({
      xiaojueding: data.data,
      myxiaojueding: data.data
    })
  },
  /**
   * 异步请求失败调用
   */
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

   onShareAppMessage: function () {
      let that = this;
      mta.Event.stat("share", { 'time': '1' });
      var picNum = Math.floor(Math.random() * 4 + 1);//获取1-4的随机数，用于随机展示分享图片

      return {
         title: util.isNull(app.globalData.shareTitle) ? ("一起来玩'" + app.globalData.title + "'吧") : app.globalData.shareTitle,
         path: '/pages/index/index',
         success: function (res) {
            console.log('成功进入分享==========', res);

         },
         fail: function (res) {
            console.log('进入分享失败==========', res);
         }
      }
   }
})