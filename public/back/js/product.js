/**
 * Created by Administrator on 2018/1/14.
 */
$(function () {
  var page = 1;
  var pageSize = 5;
  var imgArr = [];
  //1. 分页渲染
  //1.1 定义一个函数render
  function render() {
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
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
          size:"normal",//设置控件的大小
          //type: 具体的页码，返回page  首页-->first  上一页-->prev  下一页-->next  最后一页-->last
          //这个函数的返回值，就是按钮的内容
          itemTexts:function (type, page, current) {
            //根据type的不同，返回不同的字符串
            console.log(type, page, current);
            switch (type){
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            //根据type的不同，返回不同的字符串
            console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "去第"+page+"页";
            }
            //return 111;
          },
          useBootstrapTooltip:true,//使用boostrap的tooltip

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

  //3.动态渲染模态框
  $.ajax({
    type:"get",
    url:"/category/querySecondCategoryPaging",
    data:{
      page:1,
      pageSize:100
    },
    success:function (info) {
      console.log(info);
      $('.dropdown-menu').html(template("tpl",info));
    }
  })


  //3. 给dropdown-menu下所有的a注册点击事件
  $(".dropdown-menu").on("click","a",function () {
    //3.1 获取到a的内容，设置给dropdown-text
      $(".dropdown-text").text($(this).text());
    //3.2 获取到id，给brandId
      var id = $(this).data("id");
    $("#brandId").val(id);
    //3.3 手动让这个表单校验通
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  //4. 初始化文件上传插件
  $('#fileupload').fileupload({
    dataType:"json",
    //上传成功的时候，触发的回调函数
    done:function (e,data) {
        if(imgArr.length >= 3){
          return;
        }
      console.log(data.result);
      //1.图片显示，添加成功，往img_box中添加一张图片即可
      $(".img_box").append('<img src="'+ data.result.picAddr +'"width="100" height="100" alt="">');
      //2. 把上传到结果存储到一个数组中。
      // 1. 判断数组的长度就可以知道目前上传了几张图片。
      // 2. 添加商品的时候，可以通过数组拼接出来我们想要的结果

      imgArr.push(data.result);
      console.log(imgArr);

      //3. 根据数组的长度，对productLogo进行校验
      if(imgArr.length === 3){
        $form.data("bootstrapValidator").updateStatus("productLogo","VALID");
      }else{
        $form.data("bootstrapValidator").updateStatus("productLogo","INVALID");
      }
    }
  });


  //5.表单功能校验
  var $form = $('form');
  $form.bootstrapValidator({
    //配置隐藏域校验
    excluded: [],
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields: {

      brandId: {
        validators: {
          notEmpty: {
            message: "二级分类不能为空"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "商品名称不能为空"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "商品描述不能为空"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "商品库存不能为空"
          },
          //正则：只能有数字组成，并且第一位不能是0
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: "请输入合法的库存"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "商品尺码不能为空"
          },
          //正则：只能有数字组成，并且第一位不能是0
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入合法的尺码，比如(32-44)"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "商品原价不能为空"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "商品价格不能为空"
          }
        }
      },
      productLogo: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      },

    }

  });

  //6.给表单注册校验事件
  $form.on("success.form.bv",function (e) {
    e.preventDefault();
    var param = $form.serialize();
    //拼接上数组中picName和picAddr
    param += "&picName1=" + imgArr[0].picName + "&picAddr1=" + imgArr[0].picAddr;
    param += "&picName2=" + imgArr[1].picName + "&picAddr2=" + imgArr[1].picAddr;
    param += "&picName3=" + imgArr[2].picName + "&picAddr3=" + imgArr[2].picAddr;

    console.log(param);
    //发送ajax请求
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data:param,
      success:function (info) {
        console.log(info);
          if(info.success){
            $("#addModal").modal("hide");
            page=1
            render();
            $form.data("bootstrapValidator").resetForm(true);
            $(".dropdown-text").text("请选择二级分类");
            $(".img_box img").remove();//图片自杀
            //4. 清空数组
            imgArr = [];
          }
      }
    })
  })
});


