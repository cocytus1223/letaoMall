// var arr = ["耐克", "啊迪", "阿迪王", "耐克王", "老奶奶", "老北京"];
// var jsonStr = JSON.stringify( arr );
// localStorage.setItem( "search_list", jsonStr );

$(function () {
  // 1. 本地历史记录渲染
  // 从本地读取搜索历史
  // 读出来的是jsonstr，需要转换成数组
  // 结合模板引擎渲染  

  render();
  // 获取本地历史记录数组
  function getHistory() {
    // 对没有数据时，进行默认值的处理
    var jsonStr = localStorage.getItem("search_list");
    // 将jsonstr转换成数组
    var arr = JSON.parse(jsonStr);
    return arr;
  }

  function render() {
    var arr = getHistory();
    // 结合模板引擎渲染
    var htmlStr = template('searchTpl', {
      list: arr
    });
    $('.lt_history').html(htmlStr);
  }


  // 2. 清空所有历史记录

  $('.lt_history').on("click", ".btn_empty", function () {
    mui.confirm("你确定要清空历史记录吗？", "温馨提示", ["取消", "确认"], function (e) {
      // 通过e.index标记点击按钮对应的下标
      if (e.index === 1) {
        // 移除本地历史
        localStorage.removeItem("search_list");
        // 重新渲染页面
        render();
      }
    })
  })

  // 3. 删除单条历史记录
  $('.lt_history').on("click", ".btn_delete", function () {
    // 获取下标
    var index = $(this).data("index");
    // 获取数据
    var arr = getHistory();
    // 根据下标，删除数组的对应项
    arr.splice(index, 1);
    // 转成jsonstr,存入本地存储
    localStorage.setItem("search_list", JSON.stringify(arr));
    // 重新渲染
    render();
  })

  // 4. 添加历史记录功能
  $('.search_btn').click(function () {
    var key = $('.search_input').val().trim();

    // 非空处理
    if (key === "") {
      // 提示请输入关键字
      mui.toast("请输入搜索关键字");
      return;
    }

    // 获取数组
    var arr = getHistory();

    // 如果已经有了重复项，需要将重复项删除
    var index = arr.indexOf(key);
    if (index != -1) {
      arr.splice(index, 1);

    }
    // 如果长度超过10个，需要删除最后一个
    if (arr.length > 10) {
      arr.pop();
    }

    // 往数组最前面追加
    arr.unshift(key);

    // 转成json，存储到本地
    localStorage.setItem("search_list", JSON.stringify(arr));

    render();

    $('.search_input').val("");

    // 跳转到商品列表页
    location.href = "search_list.html?key=" + key;
  })
})