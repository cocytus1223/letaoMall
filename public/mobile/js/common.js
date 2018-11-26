// 进行 scroll 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  indicators: false
});

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});

// 解析地址栏参数的方法
function getSearch(k) {
  // 获取地址栏参数
  var str = location.search;
  // 解码成中文, 将地址栏编码后的中文, 进行解码
  str = decodeURI(str);

  // 去掉第一个问号
  str = str.slice(1);

  // split 将字符串分割数组
  var arr = str.split("&");

  var obj = {};

  // 遍历数组, 取出每个键和值
  arr.forEach(function (v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];

    obj[key] = value;
  })

  return obj[k];
}