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

  // 点击启用禁用按钮，显示模态框
  $('tbody').on("click", ".btn", function () {
    // 显示模态框
    $('#userModal').modal("show");
    // 获取用户 id
    currentId = $(this).parent().data("id");
    // 获取需要修改的状态, 根据按钮的类名来判断具体传什么
    // 禁用按钮 ? 0 : 1;
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });

  // 点击模态框的确认按钮，完成用户的启用禁用
  $('#submitBtn').click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId, // 用户id
        isDelete: isDelete // 将用户改成什么状态, 1启用, 0禁用
      },
      dataType: "json",
      success: function (info) {
        console.log(info)
        if (info.success) {
          // 关闭模态框
          $('#userModal').modal("hide"); // show hide
          // 重新渲染页面
          render();
        }
      }
    })
  })
})