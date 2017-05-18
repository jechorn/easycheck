// pages/local-detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://m.maoyan.com/showtime/wrap.json?cinemaid=',
    cinemaId: '',
    cinemaData: {},
    currentMovie: 0,
    backgroundImageIndex: 1,
    currentMovieId: '',
    containerShow: '',
    chooseDate: '',
    isSaleOnLIne: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      duration: 6000
    });

    this.data.cinemaId = options.id;
    this.getCinemaDetail(options.id);

  },

  //获取电影院的详细信息
  getCinemaDetail: function (cinemaId) {
    var that = this;
    //console.log(this.data.url+cinemaId+'&movieid='+this.data.currentMovieId);
    var error = function () {
      that.setData({
        containerShow:false
      });
      wx.showToast({
        title: '无法加载数据',
        icon: 'success',
        duration: 1500
      });
    };
    wx.request({
      url: this.data.url + cinemaId + '&movieid=' + this.data.currentMovieId,
      success: function (res) {
        console.log(res);
        console.log('success');
        if (res.statusCode == 200 && res.data !== '') {
          //console.log(res);
          var currentMovieId;
          var chooseDate;
          var dateArray;
          var isSaleOnLIne = false;
          if (res.data.data.movies.length <= 0) {
            currentMovieId = '';
            chooseDate = '';
          } else {
            currentMovieId = res.data.data.movies[that.data.currentMovie].id;
            chooseDate = res.data.data.Dates[0].slug;
            isSaleOnLIne = true;
          }


          //console.log(currentMovieId);

          that.setData({
            cinemaData: res.data.data,
            currentMovieId: currentMovieId,
            containerShow: true,
            chooseDate: chooseDate,
            isSaleOnLIne: isSaleOnLIne

          });
          //console.log(that.data.isEmptyArray);
          wx.hideToast();
        } else {
          error();

        }
      },
      fail: function (res) {
        error();

      },
      complete: function (res) {
        wx.hideToast();

      }
    });


  },
  //拨打电话
  onTapCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cinemaData.cinemaDetailModel.tel[0]

    });
  },

  //查看地图
  onTapCheckMap: function () {
    wx.openLocation({
      latitude: this.data.cinemaData.cinemaDetailModel.lat,
      longitude: this.data.cinemaData.cinemaDetailModel.lng

    });
  },

  //日期选择
  onDateChoose: function (event) {
    var date = event.currentTarget.dataset.date;
    this.setData({
      chooseDate: date
    })

  },

  //swiper current值改变
  onMovieChange: function (event) {
    var current = event.detail.current;
    this.data.currentMovieId = this.data.cinemaData.movies[current].id;
    var backgroundImageIndex = Math.ceil(Math.random() * 4);
    //console.log(this.data.cinemaId);
    this.getCinemaDetail(this.data.cinemaId);
    this.setData({
      currentMovie: current,
      backgroundImageIndex: backgroundImageIndex,
    });
  },
  //电影切换点击
  onMovieTap: function (event) {
    console.log(event);

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      duration: 6000
    });
    this.getCinemaDetail(this.data.cinemaId);

  }
})