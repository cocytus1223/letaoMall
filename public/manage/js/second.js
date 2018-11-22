$(function () {

  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数

  // 1. 渲染页面
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template('secondTpl', info)
        $('tbody').html(htmlStr);

        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 版本号
          currentPage: info.page, // 当前页
          totalPages: Math.ceil(info.total / info.size), // 总页数
          // 给每个页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            // 更新当期页, 并且重新渲染
            currentPage = page;
            render();
          }
        })
      }
    })
  };

  // 2. 点击添加分类按钮, 显示模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");

    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  });

  // 3. 给下拉菜单添加选中功能 (事件委托)
  $('.dropdown-menu').on("click", "a", function () {
    // 获取文本
    var txt = $(this).text();
    // 设置给按钮里的 span
    $('#dropdownText').text(txt);

    // 获取 a 中自定义属性存储的 id
    var id = $(this).data("id");
    // 赋值给隐藏域, 用于提交
    $('[name="categoryId"]').val(id);

    // 手动将隐藏域的校验状态, 改成成功
    // updateStatus
    // 参数1. 字段名称
    // 参数2. 校验状态  VALID成功
    // 参数3. 配置校验规则, 用来配置错误提示信息
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  // 4. 调用 fileUpload 方法, 发送文件上传请求
  $('#fileupload').fileupload({
    dataType: "json", // 返回回来的数据类型
    done: function (e, data) {
      console.log(data);
      var result = data.result; // 后台返回的结果
      // 获取图片地址, 赋值给 img 的 src
      var picUrl = result.picAddr;
      $('#imgBox img').attr("src", picUrl);

      // 将图片地址赋值给隐藏域
      $('[name="brandLogo"]').val(picUrl);

      // 重置隐藏域的校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  // 5. 添加表单校验
  $('#form').bootstrapValidator({
    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })

  // 6. 注册校验成功事件, 通过 ajax 进行添加
  $("#form").on("success.form.bv", function (e) {
    // 阻止默认的提交
    e.preventDefault();

    $.ajax({
      url: "/category/addSecondCategory",
      type: "post",
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info)

        // 关闭模态框
        $('#addModal').modal("hide");
        // 重置表单里面的内容和校验状态
        $('#form').data("bootstrapValidator").resetForm(true);

        // 重新渲染第一页
        currentPage = 1;
        render();

        // 找到下拉菜单文本重置
        $('#dropdownText').text("请选择1级分类")

        // 找到图片重置
        $('#imgBox img').attr("src", "images/none.png")
      }
    })
  })

})