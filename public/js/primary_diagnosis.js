/**
 * Created by Administrator on 2017/4/27.
 */
//删除行的函数，必须要放domready函数外面
function deltr(delbtn){
    $(delbtn).parents("li").remove();
    console.log('$(this)',$(delbtn));
    //删除字段后相应的勾选标志消失
    var dId=$(delbtn).parent().children('span').attr('id');
    console.log('dId',dId);
    console.log($('.'+dId).parent().children('b'),'=========elem');
    $('.c'+dId).parent().children('b').removeClass('bg2');
};
//    点击删除按钮，字段删除  形成全局函数
$(".details li").on('click','i',function(){
    $(this).parent().remove();
});
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]); return null;
}

//点击编辑按钮
$('.open-edit').click(function(){
    $(".edit-box").css('display','block');
    //模态框获取数据
    $('.det_information b').each(function(){
        //获取class
        var comClass=$(this).attr('class');
        //获取值
        var comVal=$(this).html();
        //获取edit-det中class为comClass的input
        $("input."+comClass).val(comVal);
    });


    //性别
    if($('.det_information .gender').html()=='男'){
       $("#mans").attr({checked:"checked"});
    }else{
        $("#womans").attr({checked:"checked"});
    }

    //父模板的数据跟着变化



    $('.more b').each(function(){
        //获取class
        var comClass=$(this).attr('class');
        //获取值
        var comVal=$(this).html();
        //获取edit-det中class为comClass的input
        $("textarea."+comClass).val(comVal);
    });
})
//编辑框关闭按钮
$('.edit-box .close').click(function(){
    $(".edit-box").css('display','none');
})


//检查年龄
function ageCheck(){
    var check = true;
    if($('#edit-form .age').val()){
        if($('#edit-form .age').val()<121&&$('#edit-form .age').val()>0){
            check = true;
        }
        else{
            check = false;
        }
    }
    console.log('年龄：',check);
    return check;
}
$('#edit-form .age').focus(function(){
    if($(this).val()==""){
        $(this).siblings('.hint').removeClass('now');
    }
});

$('#edit-form .age').blur(function(){
    if($(this).val()<0||$(this).val()>120){
        $(this).siblings('.hint').addClass('now');
    }else{
        $(this).siblings('.hint').removeClass('now');
    }
});

$(function(){
    //获取recordId
    var recordId=GetQueryString('recordId');
    var id=GetQueryString('id');
    console.log('id',id);
    console.log('recordId',recordId);
    //加载病人个人资料
    $.ajax({
        type:'get',
        url:'/record/record?recordId='+recordId,
        success:function(data){
            console.log('获取到的病人资料：',data.record);
               $('.det_information .u_name').html(data.record.realName);
            $('.det_information .gender').html(data.record.gender);
            $('.det_information .age').html(data.record.age);
            $('.det_information .idCardNo').html(data.record.idCardNo);
            $('.det_information .occupation').html(data.record.occupation);
            $('.det_information .phoneNo').html(data.record.phoneNo);
            $('.more .presentIllnessHistory').html(data.record.presentIllnessHistory);
            $('.more .previousIllnessHistory').html(data.record.previousIllnessHistory);
            $('.more .personalIllnessHistory').html(data.record.personalIllnessHistory);
            $('.more .familyIllnessHistory').html(data.record.familyIllnessHistory);
            $('.more .chiefComplaint').html(data.record.chiefComplaint);
        }
    })

    //查看更多 切换面板
    $(".slide").click(function(){
        $("#panel").slideToggle("slow");
        $(".xs1").toggle();
        $(".xs2").toggle();
    })
  //加载常用病症
    $.ajax({
        type:'get',
        url:'/frequency/commonSymptomList?userId='+id,
        success:function(data){
            console.log('常用病症:',data.symptomList);
            if(data.symptomList){
                $.each(data.symptomList,function(i,item){
                    var pHtml=`<p><span class="fir">${i+1}</span><b class="mark"></b><span data-id=${item.symptomId} class="c${item.symptomId}">${item.symptom}</span></p>`
                    $('.common_disease').append(pHtml);
                })
            }
            //    勾选常见病症 ,.common_tcmd p
            $(".common_disease").on('click','p',function(){
                $(this).children(".mark").toggleClass('bg2');
// 将内容追加到已选区域  先进行判断  看区域中是否有这个id
                if($(this).children(".mark").hasClass('bg2')){
                    //获取常用病症的ID  绑定到已选疾病的li上
                    var spanId=$(this).children("span:eq(1)").attr('data-id');
                    if(!document.getElementById(spanId)){
                        $(".self-reported .details").append('<li><span id='+spanId+'>'+$(this).children("span:eq(1)").html()+'</span><i class="delete" onclick="deltr(this)">×</i></li>');
                    }else{
                        alert('此病症已添加');
                    }

                }
                //取消勾选标志  2017.11.9
                else{
                    var spanId2=$(this).children("span:eq(1)").attr('data-id');
                    if(document.getElementById(spanId2)){
                        $("#" + spanId2).parent().remove();
                    }
                }
            })
        }
    });

    //加载常用分型
    $.ajax({
        type:'get',
        url:'/frequency/commonSyndromeList?userId='+id,
        success:function(data){
            console.log('常用分型:',data.syndromeList);
            if(data.syndromeList){
                $.each(data.syndromeList,function(i,item){
                    var pHtml=` <p><span class="fir">${i+1}</span><b class="mark"></b><span data-id="${item.syndromeId}" class="c${item.syndromeId}">${item.syndrome}</span></p>`
                    $('.common_tcmt').append(pHtml);
                })
            }

            //    勾选常见分型 ,.common_tcmd p
            $(".common_tcmt").on('click','p',function(){
                $(this).children(".mark").toggleClass('bg2');

//        将内容追加到已选区域
                if($(this).children(".mark").hasClass('bg2')){
                    var spanId=$(this).children("span:eq(1)").attr('data-id');
                    if(!document.getElementById(spanId)){
                        $(".parting .details").append('<li><span id='+spanId+'>'+$(this).children("span:eq(1)").html()+'</span><i class="delete" onclick="deltr(this)">×</i></li>');
                    }else{
                        alert('此分型已添加');
                    }
                }
                //取消勾选标志  2017.11.9
                else{
                    var spanId2=$(this).children("span:eq(1)").attr('data-id');
                    if(document.getElementById(spanId2)){
                        $("#" + spanId2).parent().remove();
                    }
                }
            })
        }
    });

    //加载parentId=0的基本数据
    getNode1();
    getNode2();
})

//加载疾病诊断

//获取基本数据 parentId=0
function getNode1(){
    $.ajax({
        type:'get',
        url:'/assortment/childAssortment?parentId=0',
        success:function(data){
                //console.log(data.children);
            var liHtml='';
            $.each(data.children,function(i,item){
                liHtml+=`<li data-id=${item._id} data-isLastNode=${item.isLastNode} data-symptomId=${item.symptomId}><a href="javascript:;">${item.nodeName}</a></li>`;
            })
            $('.disease .show_tabs').html(liHtml);
            $('.disease .show_tabs li').eq(0).addClass('current');

            //加载第一个li的子节点
            //获取parentId=0 li列表
            //console.log('li:',$('.show_tabs li').eq(0).attr('data-id'));
            //var firId=$('.show_tabs li').eq(0).attr('data-id');
            //var ulHtml= $('<ul class="lf"></ul>');
            //$.ajax({
            //    type:'get',
            //    url:'/assortment/childAssortment?parentId='+firId,
            //    success:function(data){
            //        console.log('当前',data.children);
            //        var liHtml='';
            //        $.each(data.children,function(i,item){
            //            liHtml+=`<li id=${item._id} data-isLastNode=${item.isLastNode} data-symptomId=${item.symptomId}><a href="javascript:;">${item.nodeName}</a></li>`;
            //        })
            //        $('.disease .nodeBox').append(ulHtml);
            //        $(ulHtml).append(liHtml);
            //    }
            //})
        }
    })
}
//获取基本数据 parentId=0
function getNode2(){
    $.ajax({
        type:'get',
        url:'/type/childType?parentId=0',
        success:function(data){
            //console.log(data.children);
            var liHtml='';
            $.each(data.children,function(i,item){
                liHtml+=`<li data-id=${item._id} data-isLastNode=${item.isLastNode} data-syndromeId=${item.syndromeId}><a href="javascript:;">${item.nodeName}</a></li>`;
            })
            $('.tcmt .show_tabs').html(liHtml);
            $('.tcmt .show_tabs li').eq(0).addClass('current')
        }
    })
}


//疾病诊断

//    为所有li绑定点击事件
$('.disease .show_tabs').on('click','li',function(){
    $(this).addClass('current').siblings('.current').removeClass('current');
    var nodeId=$(this).attr('data-id');
    $('.disease .nodeBox').empty();
    $.ajax({
        type:'get',
        url:'/assortment/childAssortment?parentId='+nodeId,
        success:function(data){
            //var nodeId1=$(this).attr('data-id');
            var ulHtml= $('<ul class="lf"></ul>');
            var symptomId=$(this).attr('data-symptomId');
            var liHtml='';
           if($(this).attr('data-isLastNode')=='true'){
                console.log('true才能进来');
                console.log($(this));
                var cHtml=` <li  class="lf"><span id=${symptomId}>${$(this).html()}</span><i class="delete" onclick="deltr(this)">×</i></li>`;
                if(!document.getElementById(symptomId)){
                    $('.self-reported ul').append(cHtml);
                }
            }else{
               $.each(data.children,function(i,item){
                   liHtml+=`<li class="" data-id=${item._id} data-isLastNode=${item.isLastNode} data-symptomId=${item.symptomId}>
                   <a href="javascript:;">${item.nodeName}</a>
                   </li>`;
               })
               $('.disease .nodeBox').append(ulHtml);
               $(ulHtml).append(liHtml);
           }
        }.bind(this)
    })

    //    为.nodeBox所有li绑定点击事件
    $('.disease .nodeBox').on('click','li',function(){
        $(this).addClass('current').siblings('.current').removeClass('current');
        var nodeId1=$(this).attr('data-id');
        var ulHtml= $('<ul class="lf"></ul>');
        var symptomId=$(this).attr('data-symptomId');
        $.ajax({
            type:'get',
            url:'/assortment/childAssortment?parentId='+nodeId1,
            success:function(data){
                var liHtml='';
                console.log($(this).attr('data-isLastNode'));
                if($(this).attr('data-isLastNode')=='true'){
                    console.log('true才能进来');
                    console.log($(this));
                    console.log(symptomId);
                    $.ajax({
                        type:'get',
                        url:'/symptom/symptom?symptomId='+symptomId,
                        success:function(data){
                            var cHtml=` <li  class="lf"><span id=${symptomId}>${data.symptomName}</span><i class="delete" onclick="deltr(this)">×</i></li>`;
//                        console.log('data:',data);
                            if(!document.getElementById(symptomId)){
                                $('.self-reported ul').append(cHtml);
                            }
                        }
                    })
                }
                else{
                    $.each(data.children,function(i,item){
                        liHtml+=`<li class="" data-id=${item._id} data-isLastNode=${item.isLastNode} data-symptomId=${item.symptomId}>
                    <a href="javascript:;">${item.nodeName}</a>
                    </li>`;
                    })}
                    $(this).parent().nextAll().remove();
                    $(this).parent().after(ulHtml);
                    $(ulHtml).append(liHtml);
            }.bind(this)
        })
    })
});

//中医分型
//    为所有li绑定点击事件
$('.tcmt .show_tabs').on('click','li',function(){
    $(this).addClass('current').siblings('.current').removeClass('current');
    var nodeId=$(this).attr('data-id');
    $('.tcmt .nodeBox').empty();
    $.ajax({
        type:'get',
        url:'/type/childType?parentId='+nodeId,
        success:function(data){
            var ulHtml= $('<ul class="lf"></ul>');
            var liHtml='';
            var syndromeId=$(this).attr('data-syndromeId');
            if($(this).attr('data-isLastNode')=='true'){
                console.log('true才能进来');
                console.log($(this));
                var cHtml=` <li  class="lf"><span id=${syndromeId}>${$(this).html()}</span><i class="delete" onclick="deltr(this)">×</i></li>`;
                if(!document.getElementById(syndromeId)){
                    $('.parting ul').append(cHtml);
                }
            }else{
                $.each(data.children,function(i,item){
                    liHtml+=`<li class="" data-id=${item._id} data-isLastNode=${item.isLastNode} data-syndromeId=${item.syndromeId}>
                   <a href="javascript:;">${item.nodeName}</a>
                   </li>`;
                })
                $('.tcmt .nodeBox').append(ulHtml);
                $(ulHtml).append(liHtml);
            }
        }.bind(this)
    })

    //    为.nodeBox所有li绑定点击事件
    $('.tcmt .nodeBox').on('click','li',function(){
        $(this).addClass('current').siblings('.current').removeClass('current');
        var nodeId1=$(this).attr('data-id');
        var ulHtml= $('<ul class="lf"></ul>');
        var syndromeId=$(this).attr('data-syndromeId');
        $.ajax({
            type:'get',
            url:'/type/childType?parentId='+nodeId1,
            success:function(data){
                var liHtml='';
                console.log($(this).attr('data-isLastNode'));
                if($(this).attr('data-isLastNode')=='true'){
                    console.log('true才能进来');
                    console.log($(this));
                    console.log('syndromeId:',syndromeId);
                    $.ajax({
                        type:'get',
                        url:'/syndrome/syndrome?syndromeId='+syndromeId,
                        success:function(data){
                            var cHtml=` <li  class="lf"><span id=${syndromeId}>${data.syndromeName}</span><i class="delete" onclick="deltr(this)">×</i></li>`;
//                        console.log('data:',data);
                            if(!document.getElementById(syndromeId)){
                                $('.parting ul').append(cHtml);
                            }
                        }
                    })
                }
                else{
                    $.each(data.children,function(i,item){
                        liHtml+=`<li class="" data-id=${item._id} data-isLastNode=${item.isLastNode} data-syndromeId=${item.syndromeId}>
                    <a href="javascript:;">${item.nodeName}</a>
                    </li>`;
                    })}
                $(this).parent().nextAll().remove();
                $(this).parent().after(ulHtml);
                $(ulHtml).append(liHtml);
            }.bind(this)
        })
})
});



//提交编辑后数据
$('.edit-btn').click(function(){
    console.log(ageCheck(),'===ageCheck()');
    if(ageCheck()) {
        $.ajax({
            type: 'put',
            url: '/record/record',
            data: {
                realName: $('input.u_name').val(),
                idCardNo: $('input.idCardNo').val(),
                phoneNo: $('input.phoneNo').val(),
                occupation: $('input.occupation').val(),
                address: $('input.address').val(),
                presentIllnessHistory: $('textarea.presentIllnessHistory').val(),
                previousIllnessHistory: $('textarea.previousIllnessHistory').val(),
                chiefComplaint: $('textarea.chiefComplaint').val(),
                personalIllnessHistory: $('textarea.personalIllnessHistory').val(),
                familyIllnessHistory: $('textarea.familyIllnessHistory').val(),
                doctorId: 1,
                age: $('input.age').val(),
                gender: $('input:radio[name="sex"]:checked').val(),
                recordId: GetQueryString('recordId')
            },
            success: function (data) {
                if (data.errcode == 0) {
                    //alert('修改成功');
                    window.location.reload();
                }
            }
        })
    }else{
        alert('请填写规范数值')
    }
})


//当离开当前的区域时  选节点区域恢复到原状态
//var yourDiv = document.getElementById('yourDiv');
//document.body.onclick = function(e){
//    e = e || window.event;
//    var target = e.target || e.srcElement;
//    if(target != yourDiv){
//        yourDiv.style.display = 'none';
//    }
//}

//提交数据  分两次提交

//提交疾病数据
$('.submit').click(function(){
    var recordId=GetQueryString('recordId');


    sessionStorage.setItem('diseaseEntity', '');


    //未选择主诉及分型  提醒
    if($('.self-reported li').length==0||$('.parting li').length==0){
        console.log(111);
        alert('请完整填写主诉及分型信息！')
    }
    else{
        //将分型存储起来
        var spanId1=$(".parting .details span");
        var arr1=new Array();
        for(var i=0;i<spanId1.length;i++){
            arr1.push(spanId1[i].id);
        }
        var tcmtStr=arr1.join("&");
        sessionStorage.setItem('tcmtStr', tcmtStr);
        console.log('tcmtStr:',tcmtStr);

        //将疾病存储起来
        var spanId=$(".self-reported .details span");
        var arr=new Array();
        for(var i=0;i<spanId.length;i++){
            arr.push(spanId[i].id);
        }
        var diseaseStr=arr.join("&");
        sessionStorage.setItem('diseaseStr', diseaseStr);
        console.log('diseaseStr:',diseaseStr);
        location.href='/diseaseDiagnosisPage?recordId='+recordId;
    }
})
