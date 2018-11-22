$(function () {

  var currentPage = 1;
  var pageSize = 5;

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize
      },
      dateType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("firstTpl", info);
        $('tbody').html(htmlStr);

        // 分页
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

  // 点击添加按钮，显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
  })

  // 表单校验
  $('#form').bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 配置非空
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  })

  // 注册表单校验成功事件，阻止默认的表单提交，通过ajax提交
  $('#form').on("success.form.bv", function (e) {
    // 阻止默认的提交
    e.preventDefault();
    // 通过 ajax 提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染页面, 重新渲染第一页
          currentPage = 1;
          render();
          // 内容和状态都要重置
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
})