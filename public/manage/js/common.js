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