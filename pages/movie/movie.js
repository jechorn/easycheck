var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载数据',
      success: function () {

      }
    });
    wx.stopPullDownRefresh();
    setTimeout(function () {
      wx.hideLoading();
    }, 4000);
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=6&city=" + app.globalData.city;
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=6";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=6";
    this.getDoubanData(inTheatersUrl, "inTheaters", "正在热映");
    this.getDoubanData(comingSoonUrl, "comingSoon", "即将上映");
    this.getDoubanData(top250Url, "top250", "豆瓣Top250");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.onLoad();
  },


  /**
   * 获取豆瓣api接口数据
   */
  getDoubanData: function (url, settedKey, categoryTitle) {
    var that = this;
    var error = function () {
      that.setData({
        containerShow: false
      });
      wx.hideLoading();

    };

    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data !== '') {
          that.processDoubanData(res.data, settedKey, categoryTitle);
          wx.hideLoading();
        } else {
          error();
        }

      },
      fail: function (res) {
         error();

      }

    })
  },

  /**
   * 豆瓣返回数据处理
   * @param moviesDouban 豆瓣返回的数据
   * @param settedKey  处理后数组的key
   * @param categoryTitle 分类标题名称
   */
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
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
    var readyData = {
      containerShow: true
    };
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
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

  },
  /**
   * 更多影片
   */
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '../movie-more/more?category=' + category

    })

  },

})