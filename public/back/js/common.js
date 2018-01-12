/**
 * Created by Administrator on 2018/1/11.
 */
$(function () {
    //进度条功能
  NProgress.configure({ showSpinner: false });//关闭进度环
  $(document).ajaxStart(function () {
    //在发送ajax之前，要开启进度条，ajax结束后，要关闭进度条。
    //使用进度条插件
    NProgress.start();
  });
  $(document).ajaxStop(function () {
    //本地接口，加了一个延时
    setTimeout(function () {
      NProgress.done();
    },1000);
  });

  //在非登录页面，发送ajax请求，询问用户是否登录，如果没登录，跳转到登录页面。


})