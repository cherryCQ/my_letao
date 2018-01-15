/**
 * Created by Administrator on 2018/1/13.
 */
$(function () {
  var page = 1;
  var pageSize = 10;
  //1. 分页渲染
  //1.1 定义一个函数render
  function render() {
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $('tbody').html( template("tpl",info));
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          numberOfPages:5,
          onPageClicked:function (a,b,c,p) {
            page=p;
            render();
          }
        })
      }

    })

  }

  render();

  //2. 添加，显示模态框
  $('.btn_add').on("click",function () {
    $('#addModal').modal("show");
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

  $(".dropdown-menu").on("click","a",function () {
      $(".dropdown-text").text($(this).text());

    var id = $(this).data("id");
    $("#categoryId").val(id);
    $form.data("bootstrapValidator").updateStatus("categoryId","VALID");

  })


  //4. 初始化文件上传功能
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      //console.log(data);
      var result = data.result.picAddr;
      $(".img_box img").attr("src",result);
      //修改隐藏域的value值
      $("#brandLogo").val(result);
      $form.data("bootstrapValidator").updateStatus("brandLogo","VALID");



    }
  });

  //5.表单校验功能
  //使用表单校验插件
  var $form = $('form');
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
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
            message:"请输入品牌的名称"
          }
        }
      }

    },
  });

  //6.给表单注册校验成功事件

  $form.on("success.form.bv",function (e) {
    //阻止默认提交
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      success:function (info) {
        console.log(info);
        if(info.success){
          $("#addModal").modal("hide");
          page=1;
          render();
          //重置表单样式
          $form.data("bootstrapValidator").resetForm(true);
          //重置按钮的值
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src","images/none.png");
        }
      }
    })
  })




})