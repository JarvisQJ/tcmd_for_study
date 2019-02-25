/**
 * Created by Administrator on 2017/4/1.
 */
//功能1：对用户输入的信息格式进行测试
//加载页面  用户名输入框自动获取焦点
window.onload = function()
{
    document.getElementById("uName").focus();
}
//当输入框失去焦点时  进行判断
$('#uName,#mainSuit').blur(function(){
    if($(this).val()==""){
        $(this).siblings('.hint').addClass('now');
    }
});
$('#age').blur(function(){
    if($(this).val()<0||$(this).val()>120){
        $(this).siblings('.hint').addClass('now');
    }else{
        $(this).siblings('.hint').removeClass('now');
    }
});
$('#IdCard').blur(function(){
    if(testIdCard($('#IdCard').val().trim())||$('#IdCard').val().trim()==''){
        $(this).siblings('.hint').removeClass('now');
    }else{
        $(this).siblings('.hint').addClass('now');
    }
});
//$('#uName,#IdCard,#mainSuit').focus(function(){
//    if($(this).val()==""){
//        $(this).siblings('.hint').removeClass('now');
//    }
//})
$('#uName,#mainSuit,#age,#IdCard').focus(function(){
    if($(this).val()==""){
        $(this).siblings('.hint').removeClass('now');
    }
});
//检查姓名
function uNameCheck() {
    var check = false;
    if($('#uName').val()==''){
        check = false;
    }
    else{
        check = true;
    }
    console.log('姓名：',check);
       return check;
    }
////检查身份证
function IdCardCheck() {
    var check = true;
    if($('#IdCard').val()) {
        if (testIdCard($('#IdCard').val().trim()) || $('#IdCard').val().trim() == '') {
            check = true;
        }
        else {
            check = false;
        }
    }
    console.log('身份证：', check);
    return check;
}
//检查主诉
function mainSuitCheck() {
    var check = false;
    if($('#mainSuit').val()==''){
        check = false;
    }
    else{
        check = true;
    }
    console.log('主诉：',check);
    return check;
}

//检查年龄
function ageCheck(){
    var check = true;
    if($('#age').val()){
        if($('#age').val()<121&&$('#age').val()>0){
            check = true;
        }
        else{
            check = false;
        }
    }
    console.log('年龄：',check);
    return check;
}

//总判断函数
//    验证正则
//身份证号(18位)正则
var testIdCard=function(val){
    var cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return(cP.test(val))
}

//提交数据
$('.submit').click(function(){
    console.log(ageCheck(),'==age');
    console.log(IdCardCheck(),'==IdCardCheck');
    if(uNameCheck()&&mainSuitCheck()&&ageCheck()&&IdCardCheck()){
       $.ajax({
           type:'post',
           url:'/record/record',
           data:{
               realName:$('#uName').val().trim(),
               idCardNo:$('#IdCard').val().trim(),
               phoneNo:$('#phone').val().trim(),
               occupation:$('#profession').val().trim(),
               address:$('#address').val().trim(),
               presentIllnessHistory:$('#nHistory').val().trim(),
               previousIllnessHistory:$('#aHistory').val().trim(),
               chiefComplaint:$('#mainSuit').val().trim(),
               personalIllnessHistory:$('#pHistory').val().trim(),
               familyIllnessHistory:$('#fHistory').val().trim(),
               doctorId:sessionStorage.getItem('id'),
               age:$('#age').val().trim(),
               gender:$('input:radio[name="sex"]:checked').val()
           },
           success:function(data){
               console.log('填写数据:',data);
               if (data.errcode == 0) {
                   console.log('success');
                   console.log('recordId:',data.recordId);
                   location.href='primaryDiagnosisPage?recordId='+data.recordId+'&id='+sessionStorage['id'];
               }

           }
       })
    }else{
        alert('请正确填写信息');
        console.log('fail');
    }
})
