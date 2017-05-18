// pages/local/local.js

var util = require('../../utils/util.js');
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'SFXBZ-6TC3O-FK7WJ-SXHE6-7D3G7-YCBW4' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    animationSecond: {},
    isAnimate: false,
    isActive: false,
    currentArea: '',
    areasData: [],
    location: {},
    chooseLocation: {},
    cinemas: {},
    cinemasUrl: 'http://m.maoyan.com/cinemas.json',
    containerShow: '',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      duration: 6000
    });
    this.getLocation();

  },

  //影院信息处理
  handleCinemasData: function (data) {
    var areasData = [];
    var cinemas = [];
    for (var idx in data.data) {
      areasData.push(idx);
      var subject = data.data[idx];
      for (var key in subject) {
        var lat1 = this.data.location.latitude;
        var lng1 = this.data.location.longitude;
        var lat2 = subject[key].lat;
        var lng2 = subject[key].lng;
        var distance = this.getDistance(lat1, lng1, lat2, lng2);
        subject[key].distance = distance.toFixed(2);
        cinemas.push(subject[key]);
      }

    }
    cinemas = this.quickSort(cinemas);
    //console.log(cinemas);
    this.setData({
      cinemas: cinemas,
      areasData: areasData,
      containerShow: true
    });
    wx.hideToast();

  },



  //冒泡排序
  //影院数据处理
  bubbleSort: function (data) {

    var i = 0;
    var len = data.length;
    var d;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (parseFloat(data[i].distance) < parseFloat(data[j].distance)) {
          d = data[j];
          data[j] = data[i];
          data[i] = d;

        }
      }

    }

    return data;


  },


  //快速排序
  //影院数据处理
  quickSort: function (data) {

    if (data.length <= 1) {
      return data;
    }
    //取基准点  
    var midIndex = Math.floor(data.length / 2);
    //取基准点的值,splice(index,1)函数可以返回数组中被删除的那个数arr[index+1] 
    var midIndexVal = data.splice(midIndex, 1)[0];

    var distance = midIndexVal.distance;


    //存放比基准点小的数组  
    var left = [];
    //存放比基准点大的数组  
    var right = [];
    //遍历数组，进行判断分配 
    for (var i = 0; i < data.length; i++) {

      if (parseFloat(data[i].distance) < parseFloat(distance)) {
        left.push(data[i]);//比基准点小的放在左边数组  
      }
      else {
        right.push(data[i]);//比基准点大的放在右边数组  
      }

    }
    //递归执行以上操作,对左右两个数组进行操作，直到数组长度为<=1；  
    return this.quickSort(left).concat([midIndexVal], this.quickSort(right));

  },



  onLocationTap: function () {
    //this.getLocation();
    this.animateQueue();
  },

  //处理地区事件
  handleAreas: function (data) {
    //console.log(data);
    var areasData = [];
    for (var idx in data.data) {
      var subject = data.data[idx];
      areasData.push(idx);

    }
    this.setData({
      areasData: areasData
    });
  },

  //获取当前位置
  getLocation: function () {
    var that = this;

    //获取位置信息
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var location = {
          latitude: res.latitude,
          longitude: res.longitude,
          LocationName: ''

        };


        demo.reverseGeocoder({
          location: location,
          success: function (res) {

            //console.log(res)
            var LocationName = res.result.ad_info.city;
            location.LocationName = LocationName;
            that.setData({
              location: location,
              currentArea: LocationName
            });
          }
        });

        util.http({
          url: that.data.cinemasUrl,
          callback: that.handleCinemasData,
          error: function (data) {
            console.log(res);
            that.setData({
              containerShow: false
            });
            wx.showToast({
              title: '数据加载失败',
              icon: 'success',
              duration: 1500

            });

          }
        });

      }
    });

  },

  //选择地区动画队列
  animateQueue: function () {

    //
    var animation = wx.createAnimation({
      transformOrigin: "50% 0 0",
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    var animationFirst = animation;
    var animationSecond = animation;
    var isAnimate;
    //animation.rotate('180deg').step();
    if (this.data.isAnimate === false) {
      isAnimate = true;
      animation.scaleY(1).height('480rpx').step();

    } else {
      isAnimate = false;
      animation.scaleY(0).height('0rpx').step();

    }

    this.setData({
      isAnimate: isAnimate,
      animationData: animation.export(),
      animationSecond: animation.export()
    });
  },
  //选择地区
  chooseArea: function (event) {
    //console.log(event);

    var currentArea = event.currentTarget.dataset.area;
    this.setData({
      currentArea: currentArea
    });
    this.animateQueue();


  },

  //选择列表
  onTapList: function (event) {
    var cinemaId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../local-detail/detail?id=' + cinemaId,
    })

    //console.log(cinemaId);
  },


  //清空位置信息
  clearLocation: function () {
    var chooseLocation = {};
    this.setData({ chooseLocation });
    //console.log(this.data);
  },
  /**
   * 选择位置
   */
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var chooseLocation = {
          chooseLocation: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        };
        that.setData({
          chooseLocation: chooseLocation
        });
        //console.log(that.data);
        that.computeDistance();
      },
      fail: function (res) {
        //console.log(res)

      }
    });

  },

  //经纬度转换成三角函数中度分表形式。
  Rad: function (d) {
    return d * Math.PI / 180.0;
  },


  //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  getDistance: function (lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
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


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  }
})