$(document).ajaxStart(function () {
  // 开启进度条
  NProgress.start();
})

$(document).ajaxStop(function () {
  // 模拟网络延迟
  setTimeout(function () {
    // 关闭进度条
    NProgress.done();
  }, 500)
});

$(function () {

  // 1. 左侧二级列表切换功能
  $('#category').click(function () {
    // 找下一个兄弟元素
    $(this).next().stop().slideToggle();
  })

  // 2. 左侧菜单切换功能
  $('.lt_topbar .icon_left').click(function () {
    // 让左侧侧边菜单切换
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  })

  // 3. 公共退出功能
  $('.lt_topbar .icon_right').click(function () {
    // 显示退出模态框
    $('#logoutModal').modal("show");
  });

  $('#logoutBtn').click(function () {

    // 调用接口, 让后台销毁当前用户的登录状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        if (info.success) {
          // 销毁登录状态成功, 退出成功, 跳转登录页
          location.href = "login.html";
        }
      }
    })
  })
})