/**
 * Created by HUCC on 2018/1/11.
 */
$(function () {


  //要求用户名不能为空
  //要求密码不能为空，并且长度是6-12
  //表单校验插件，在表单提交的时候做校验，如果校验失败了，会阻止表单的提交。如果校验成功了，它就会让表单继续提交。
  var $form = $("form");
  //初始化表单校验插件
  $form.bootstrapValidator({

    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置校验规则,name属性
    fields:{
      //配置username的校验规则
      username:{

        //里面可以配置username所有的校验。
        validators:{
          //非空校验
          notEmpty:{
            //提示信息
            message:"用户名不能为空哦！"
          },
          callback:{
            message:"用户名不存在"
          }

        }

      },
      password:{
        validators:{
          //非空校验
          notEmpty:{
            message:"用户密码不能为空哦！"
          },
          //长度校验
          stringLength:{
            min:6,
            max:12,
            message:"密码必须是6-12位"
          },
          //是用于校验失败后，提示的信息
          callback:{
            message:"密码错误"
          }
        }
      }
    }

  });


  //需要给表单注册一个校验成功的事件，这个事件在表单校验成功的时候会触发。success.form.bv
  $form.on("success.form.bv", function (e) {
    //阻止表单提交
    e.preventDefault();
    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      //注意：dataType:jquery会根据后端返回的类型自动识别，
      //content-type:text/json   text/html
      //dataType:"json",
      data: $form.serialize(),
      success:function (info) {

        //登录成功
        if(info.success){
          //跳转到index页面
          location.href = "index.html";
        }

        //失败
        if(info.error == 1000){

          //使用updateStatus方法，把用户名改成失败即可
          // $form.data("bootstrapValidator") 用于获取插件实例，通过这个实例可以调用方法
          //3个参数：
          //1. 字段名，，，，，username
          //2. 状态  ： VALID   INVALID
          //3. 显示哪个校验的内容
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
          //alert(info.message);
        }

        if(info.error == 1001){
          //手动把password改成INVALID
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }

      }

    });


  })


  //给reset按钮注册一个点击事件
  $("[type='reset']").on("click", function () {
    //重置校验的样式
    $form.data("bootstrapValidator").resetForm();
  });
});