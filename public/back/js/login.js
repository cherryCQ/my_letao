/**
 * Created by Administrator on 2018/1/11.
 */
$(function () {
  //要求用户名不能为空
  //要求密码不能为空，并且长度是6-12
  //表单校验插件，在表单提交的时候做校验，如果校验失败了，会阻止表单的提交。如果校验成功了，它就会让表单继续提交。
  var $form = $('form');
  $form.bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验规则,name属性
    fields: {
      //配置username的校验规则
      username: {
        //里面可以配置username所有的校验。
        validators:{
          //不能为空
          notEmpty: {
            //提示信息
            message: '用户名不能为空'
          },
          callback: {
            message:"用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码必须在6到12位之间'
          },
          callback: {
            message:"密码错误"
          }
        }
      },
    },
  });

  //需要给表单注册一个校验成功的事件，这个事件在表单校验成功的时候会触发。success.form.bv
  $form.on('success.form.bv', function (e) {
    //阻止浏览器默认行为
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data: $form.serialize(),
      success:function (info) {
        //console.log(info);
        if(info.success){
          location.href="index.html";
        }
        if(info.error == 1000){
          //使用updateStatus方法，把用户名改成失败即可用于获取插件实例，通过这个实例可以调用方法
          //3个参数：
          //1.字段名，，，，username
          //2.状态 ： valid invalid
          //3.显示那个校验的内容
          $form.data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if(info.error == 1001){
          $form.data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })



  });

  $('.btn_reset').on("click",function () {
      $form.data("bootstrapValidator").resetForm();
  });

})