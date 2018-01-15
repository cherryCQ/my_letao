/**
 * Created by Administrator on 2018/1/13.
 */
$(function () {
  var page = 1; //记录页码
  var pageSize = 10;  //每页的条数

  function render() {
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
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
  });

  //表单校验
  var $form = $('form');
  $form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
      categoryName:{
        validators: {
          //不能为空
          notEmpty: {
            message: '一级分类的名称不能为空'
          }
      }
    },
  }
  });

  //给表单注册校验成功的事件 {
  $form.on("success.form.bv",function (e) {
    //阻止默认提交
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$form.serialize(),
      success:function (info) {
        //console.log(info);
        if(info.success){
          $("#addModal").modal("hide");
          render();
          $form.data("bootstrapValidator").resetForm(true);
        }

      }
    })
  })
})