$(function () {

  var currentPage = 1;
  var pageSize = 5;

  var currentId; // 当前用户id

  var isDelete; // 修改的状态

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize
      },
      dataType: "json",
      success: function (info) {
        var htmlStr = template("tmp", info);
        $('tbody').html(htmlStr);

        // 分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 指定版本号
          currentPage: info.page, // 当前页
          totalPages: Math.ceil(info.total / info.size), // 总页数
          size: "large", // 设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            // 为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            // 根据page重新渲染
            render(currentPage);
          }
        })
      }
    })
  }
})