/**
 * Created by HUCC on 2018/1/13.
 */
$(function () {


  var page = 1;
  var pageSize = 10;
  //1. 分页渲染
  //1.1 定义一个函数render
  var render = function () {
    //1.2 发送ajax请求，通过模版引擎渲染出来
    //1.3 渲染分页
    $.ajax({
      type: 'get',
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //通过模版引擎渲染出来
        console.log(info);
        $("tbody").html(template("tpl", info));

        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            //修改page的值，重新渲染
            page = p;
            render();
          }
        });

      }
    })
  };

  render();


  //2. 添加，显示模态框
  $(".btn_add").on("click", function () {

    $("#addModal").modal("show");


    //发送ajax请求，获取所有的一级分类的数据，渲染到下拉框
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);

        $(".dropdown-menu").html(template("menuTpl", info));

      }
    })

  });

  //3. 下拉列表选中功能
  //3.1 给下拉列表中的a注册点击事件
  //3.2 获取点击的a标签的内容，设置给dropdown-text的内容
  $(".dropdown-menu").on("click", "a", function () {
    //修改了按钮的内容
    var content = $(this).text();
    $(".dropdown-text").text(content);

    //获取id，把id赋值给categoryId的隐藏
    var id = $(this).data("id");
    $("#categoryId").val(id);

    //手动把categoryId设置为VALID状态
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  //4. 初始化文件上传功能
  $("#fileupload").fileupload({
    dataType: 'json',
    //文件上传成功时，会执行的回调函数
    done: function (e, data) {
      //通过data.result可以获取到一个对象，这个对象的picAddr属性就是图片的地址
      console.log(data);
      var result = data.result.picAddr;
      $(".img_box img").attr("src", result);

      //修改隐藏域的value值
      $("#brandLogo").val(result);

      //让brandLogo改为VALID状态
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });


  //5.表单校验功能
  var $form = $("form");
  $form.bootstrapValidator({
    //配置不做校验的内容，给空数组，目的是让隐藏的和禁用的都做校验
    excluded:[],
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验规则
    fields:{

      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入品牌的名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传品牌的图片"
          }
        }
      }
    }
  });


  //6. 给表单注册校验成功事件
  $form.on("success.form.bv", function (e) {
    //阻止默认提交
    e.preventDefault();

    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      success:function (info) {
        if(info.success) {
          //隐藏模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          page = 1;
          render();

          //重置表单样式
          $form.data("bootstrapValidator").resetForm(true);
          //重置按钮的值，图片的值
          //dropdown-text是一个span，不能用val，用text方法
          $(".dropdown-text").text('请选择一级分类');
          $(".img_box img").attr("src", 'images/none.png');
        }
      }
    })
  });

});