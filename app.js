// 引入SDK核心类
var QQMapWX = require('libs/qqmap-wx/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'SFXBZ-6TC3O-FK7WJ-SXHE6-7D3G7-YCBW4' // 必填
});


App({
  /**
   * 全局变量
   */
  globalData: {
    doubanBase: "https://api.douban.com",
    city: "北京"
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var locallocation = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        demo.reverseGeocoder({
          location: locallocation,
          success: function (res) {
            var city = res.result.ad_info.city;
            city = city.substr(0, city.length-1);
            that.globalData.city = city;

          }
        });
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    });

    


  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
