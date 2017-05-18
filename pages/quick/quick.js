// pages/quick/quick.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videos: [],
    page: 1,
    maxtime: '',
    totalPages: '',
    url: 'http://api.budejie.com/api/api_open.php?a=list&c=data&type=41',
    currentVideo: null,
    containerShow: '',
    isLoadMore:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isLoadMore  = false;
    this.getData(isLoadMore);


  },
  //获取数据
  getData: function (isLoadMore) {
    var that = this;
    var url = this.data.url + '&page=' + this.data.page + '&maxtime=' + this.data.maxtime;
    util.http({
      url: url,
      callback: function (data) {
        var totalPages = data.info.page;
        var maxtime = data.info.maxtime;
        var videos = data.list;
        videos = that.data.videos.concat(videos);
        var page = that.data.page + 1;
        that.setData({
          totalPages: totalPages,
          videos: videos,
          page: page,
          maxtime: maxtime,
          containerShow: true,
          isLoadMore:isLoadMore
        });

      },
      error: function (res) {
        var containerShow = (isLoadMore ?true: false);
        that.setData({
          containerShow: containerShow
        })


      },
      done:function(){
        wx.stopPullDownRefresh();
      }
    });


  },

  //播放视频
  playVideo: function (event) {
    var videoId = event.currentTarget.dataset.videoid;
    var videoIndex = event.currentTarget.dataset.index;
    this.setData({
      currentVideo: {
        id: videoId,
        videoIndex: videoIndex,
        isPlay: true,
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var isLoadMore  = true;
    this.getData(isLoadMore);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var isLoadMore  = false;
    var maxtime = '';
    var page = 1;
    this.setData({
      maxtime:maxtime,
      page:page
    });
    this.getData(isLoadMore);
  }
})