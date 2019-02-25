//功能点1：异步加载页头和页尾
// $('#footer').load('data/footer.php');
//功能点2：验证用户名与密码
// $(".btn").click(function(){
//     var uname = $('[name="uname"]').val();
//     var upwd = $('[name="upwd"]').val();
//     $.ajax({
//         type:'post',
//         //url:'data/login.php',
//         data:{'uname':uname,'upwd':upwd},
//         success:function(txt,msg,xhr){
//             if(txt==='err'){
//                 console.log(1);
//                 alert('用户名或密码错误！请重试！');
//             }else if(txt==='ok'){
//                 location.href='index.html';
//                 localStorage.setItem('LoginName', uname);
//             }
//         }
//
//     })
// })

$(function () {
    $(document).keydown(function(event){
        if(event.keyCode==13){
            $("#btn").click();
        }
    });

    $("#btn").click(function () {
      console.log("点击登录");
        $.ajax({
            async: false,
            type: "get",
            url: "/login/mylogin",
            data: {
                phoneNo:$("#uname").val(),
                password:$("#upwd").val()
            },
            success: function (result) {
                console.log(result);
                if(result.realName){

                    location.href="/indexNPage";
                    sessionStorage.setItem('docName', result.realName);
                    sessionStorage.setItem('id', result._id);
                }else {

                    alert("账号或密码错误！");
                }

            },
            error:function () {
                console.log('error')
            }

        });

    })

})