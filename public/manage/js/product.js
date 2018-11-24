$(function () {

  var picArr = [];
  // 1. 一进入页面发送ajax请求进行渲染
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $('tbody').html(htmlStr);

        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPage: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  // 2. 点击添加商品按钮，显示模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    // 发送ajax请求二级分类数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
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
  })

  // 3. 给下拉框a添加点击事件
  $('.dropdown-menu').on("click", "a", function () {
    // 获取文本，设置给按钮
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    // 获取id，设置给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
    // 将隐藏域的校验状态改成VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })
  // 4. 配置fileupload实现文件上传
  $('#fileupload').fileupload({
    dataType: "json",
    done: function (e, data) {
      var picObj = data.result;
      picArr.unshift(picObj);
      var picUrl = picObj.picAddr;
      $('#imgBox').prepend('<img src="' + picUrl + '" style="width:100px;">');

      if (picArr.length > 3) {
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      console.log(picArr);

      if (picArr.length === 3) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  })
  // 5. 配置表单校验
  $('#form').bootstrapValidator({
    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置校验规则
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输出商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是xx-xx的格式, xx是两位数字, 例如: 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });
  // 6. 注册表单校验成功事件，阻止默认的提交，通过ajax提交
  $('#form').on("success.form.bv", function (e) {
    e.preventDefault();

    var paramsStr = $('#form').serialize(); // 所有表单内容数据

    // 还需要拼接上图片地址和名称
    // paramsStr += "&key1=value1&key2=value2"
    paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 页面重新渲染第一页
          currentPage = 1;
          render();

          // 重置所有的表单内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);

          // 由于下拉菜单和图片不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择二级分类");

          // 删除图片的同时, 清空数组
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })
})