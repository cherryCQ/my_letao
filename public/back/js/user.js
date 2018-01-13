/**
 * Created by Administrator on 2018/1/13.
 */
$(function () {
   var page = 1; //记录页码
  var pageSize = 5;  //每页的条数

  render();

  function render() {
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data: {
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $('tbody').html( template("tpl",info) );
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          numberOfPages:5,//控件上显示的条数
          onPageClicked:function(a,b,c,p){
            //为按钮绑定点击事件 page:当前点击的按钮值
            //console.log(p);
            //让当前页码变成p
            page = p;
            //重新渲染即可
            render();
          }
        })
      }
    });
  }

  //用户启用禁用的功能
  //1. 给禁用或者启用注册点击事件， 需要注册委托事件
  //2. 弹出模块框

  $('tbody').on("click",".btn",function () {
    //让模态框显示
    $("#userModal").modal("show");
    //获取到id
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-success")?1:0;
    //获取到是否禁用  如果是btn-success类，说明需要启用这个用户，需要传1
    $(".btn_confirm").off().on("click",function () {
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function (info) {
            //console.log(info);
          if(info.success){
            //关闭模态框
            $("#userModal").modal("hide");
            //重新渲染页面
            render();
          }
        }
      })
    })
  });



})