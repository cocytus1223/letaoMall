// 登录拦截
$.ajax({
  type: "get",
  url: "/employee/checkRootLogin",
  dataType: "json",
  success: function (info) {
    console.log(info);
    if (info.success) {
      // 该用户已登录
      console.log("该用户已登录");
    }
    if (info.error === 400) {
      // 未登录, 拦截到登录页
      location.href = "login.html";
    }
  }
})