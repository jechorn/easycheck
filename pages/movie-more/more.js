var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    scrollY: true,
    containerShow: '', 
    isLoading:false,  //判断是否页面正在加载中
    isDone:false      //判断是否已经加载完数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '正在加载中',
      icon: 'loading',
      duration: 6000

    });
    var that = this;
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = '';
    this.getClientHeight();
    //console.log(this.data);
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";

        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });

    this.data.requestUrl = dataUrl;
    util.http({
      url: dataUrl,
      callback: this.processDoubanData,
      error: function () {
        wx.hideToast();
        that.setData({
          containerShow: false
        })

      }
    });


  },

  getClientHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 'px'
        });
      }
    });

  },
  /**
   * 滚动到底部
   */
  onReachBottom: function (event) {
    this.setData({isLoading:true});
    var that = this;
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";

    util.http({
      url: nextUrl,
      callback: this.processDoubanData,
      error: function () {
        wx.hideToast();
        that.setData({
          containerShow: false
        })
      }
    });
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh: function (event) {
    var that = this;
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http({
      url: refreshUrl,
      callback: this.processDoubanData,
      error: function () {
        wx.hideToast();
        that.setData({
          containerShow: false
        })

      }
    });
    wx.showNavigationBarLoading();
  },



  /**
 * 豆瓣返回数据处理
 * @param moreMovie 豆瓣返回的数据
 * @param settedKey  处理后数组的key
 * @param categoryTitle 分类标题名称
 */
  processDoubanData: function (moreMovie) {
    console.log(moreMovie);
    var movies = [];
    for (var idx in moreMovie.subjects) {
      var subject = moreMovie.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        //豆瓣评分
        average: subject.rating.average,
        //image路径
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;

    }
    this.setData({
      movies: totalMovies,
      containerShow: true,
      isLoading:false
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    wx.hideToast();
  },
  /**
 * 电影详情进入
 */
  onMovieTap: function (event) {

    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/detail?id=' + movieId,
      success: function () {

      }

    });

  }



})