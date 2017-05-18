var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {},
    containerShow: '',
    movieId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    });
    var that = this;
    setTimeout(function () {
      wx.hideLoading();
    }, 6000);
    var movieId = options.id;
    this.data.movieId = movieId;

    this.getDetail(movieId);
    //this.data.containerShow =  true;
  },

  getDetail: function (movieId) {
    var that = this;
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http({
      url: url,
      callback: that.handleMovieDetail,
      error: function () {
        wx.hideLoading();
        that.setData({
          containerShow: false
        })
      }
    })


  },

  handleMovieDetail: function (data) {


    /**
     * @param average 评分，
     * @param stars 五星
     * @param title 电影名称
     * @param year 上映时间
     * @param countries 制作国家
     * @param genres 影片类型
     * @param casts 明星
     * @param  directors 导演
     * 
     */

    var totalCasts = [];
    for (var idx in data.casts) {
      totalCasts.push(data.casts[idx].name);
    }

    totalCasts = totalCasts.join('/');

    var totalDirectors = [];
    for (var ins in data.directors) {
      totalDirectors.push(data.directors[ins].name);

    }
    totalDirectors = totalDirectors.join('/');

    var movieDetail = {
      average: data.rating.average,
      stars: util.convertToStarsArray(data.rating.stars),
      title: data.title,
      image: data.images.large,
      year: data.year,
      countries: data.countries.join('/'),
      genres: data.genres.join('/'),
      totalCasts: totalCasts,
      casts: data.casts,
      directors: totalDirectors,
      reviews_count: data.reviews_count,
      wish_count: data.wish_count,
      summary: data.summary
    }

    this.setData({
      movieDetail: movieDetail,
      containerShow: true

    });
    if (this.data.containerShow) {
      wx.hideLoading();
    }

    wx.setNavigationBarTitle({
      title: this.data.movieDetail.title
    });


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //刷新页面
  onPullDownRefresh: function (event) {
    this.getDetail(this.data.movieId);
  }

})