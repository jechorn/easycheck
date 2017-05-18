function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(options) {
  options = options || {};
  if (!options.url || !options.callback) {
    throw new Error("参数不合法");
  }
  options.url = options.url;
  var callBack = options.callback;
  var error = options.error ||function(){};
  var done = options.done ||function(){};
  options.method = (options.method || 'GET').toUpperCase();

  wx.request({
    url: options.url,
    method: options.method,
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      if (res.statusCode == 200 && res.data != '') {
        callBack(res.data);
      } else {
        error(res);
      }
      //console.log(res)

    },
    fail: function (res) {
      error(res);
      
      //console.log(res)
    },
    complete: function (res) {
      done(res);
      //wx.hideToast();
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}