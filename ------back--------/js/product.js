/**
 * Created by HUCC on 2018/1/14.
 */
$(function () {

  //渲染列表
  var page = 1;
  var pageSize = 5;
  var imgArr = [];//存储了上传的图片的结果。

  var render = function () {
    //ajax请求数据
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);

        $("tbody").html( template("tpl", info));

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function (a,b,c,p) {
            page = p;
            render();
          }
        });

      }
    })
  };
  render();


  //添加商品
  //1. 点击按钮，显示模态框，修改模态框的内容
  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");


    //2. 渲染下拉框组件
    $.ajax({
      type:"get",
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function (info) {
        console.log(info);

        $(".dropdown-menu").html( template("menuTpl", info) );
      }
    });
  });


  //3. 给dropdown-menu下所有的a注册点击事件
  $(".dropdown-menu").on("click", "a", function () {

    //3.1 获取到a的内容，设置给dropdown-text
    $(".dropdown-text").text( $(this).text() );

    //3.2 获取到id，给brandId
    $("#brandId").val(  $(this).data("id")  );

    //3.3 手动让这个表单校验通过
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");


  });


  //4. 初始化文件上传插件
  $("#fileupload").fileupload({
    dataType:'json',
    //上传成功的时候，触发的回调函数
    done:function (e, data) {
      if(imgArr.length >= 3){
        return;
      }
      console.log(data.result);
      //1. 图片显示，添加成功，往img_box中添加一张图片即可。
      $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');

      //2. 把上传到结果存储到一个数组中。
      // 1. 判断数组的长度就可以知道目前上传了几张图片。
      // 2. 添加商品的时候，可以通过数组拼接出来我们想要的结果
      imgArr.push(data.result);
      console.log(imgArr);

      //3. 根据数组的长度，对productLogo进行校验
      if(imgArr.length === 3){
        //校验通过即可
        $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
      }else {
        $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
      }


    }
  });


  //5. 表单校验功能
  var $form = $("form");
  $form.bootstrapValidator({
    //配置隐藏域校验
    excluded:[],
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields:{

      brandId:{
        validators:{
          notEmpty:{
            message:"二级分类不能为空"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"商品名称不能为空"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"商品描述不能为空"
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:"商品库存不能为空"
          },
          //正则：只能有数字组成，并且第一位不能是0
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"请输入合法的库存"
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:"商品尺码不能为空"
          },
          //正则：只能有数字组成，并且第一位不能是0
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入合法的尺码，比如(32-44)"
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"商品原价不能为空"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"商品价格不能为空"
          }
        }
      },
      productLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      },

    }

  });


  //6. 给表单注册校验成功事件
  $form.on("success.form.bv", function (e) {
    e.preventDefault();


    var param = $form.serialize();

    //拼接上数组中picName和picAddr
    param += "&picName1="+imgArr[0].picName + "&picAddr1="+imgArr[0].picAddr;
    param += "&picName2="+imgArr[1].picName + "&picAddr2="+imgArr[1].picAddr;
    param += "&picName3="+imgArr[2].picName + "&picAddr3="+imgArr[2].picAddr;

    console.log(param);
    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:param,
      success:function (info) {
        if(info.success) {
          //1. 隐藏模态框
          $("#addModal").modal("hide");
          //2. 重新渲染第一页
          page = 1;
          render();

          //3. 重置表单
          $form.data("bootstrapValidator").resetForm(true);

          $(".dropdown-text").text("请选择二级分类");
          $(".img_box img").remove();//图片自杀

        }
      }
    })

  })
});