/**
 * Created by Administrator on 2017/4/28.
 */

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]); return null;
}



var recordId=GetQueryString('recordId');
//获取症状
var diseaseStr=sessionStorage['diseaseStr'];
//获取tcmt
var tcmtStr=sessionStorage['tcmtStr'];

console.log('初始化页面recordId:',recordId);
console.log('初始化页面recordId:',diseaseStr);
console.log('初始化页面recordId:',tcmtStr);
$(function(){
    $.ajax({
        type:'post',
        url:'/disease_symptom/diagnoseDisease',
        data:{'userId':sessionStorage['id'],'chosenSymptom':diseaseStr,'recordId':recordId,'diseaseEntity':sessionStorage.getItem('diseaseEntity')},
        success:function(data){
            console.log('data:',data);
            if (data.errcode == 0) {
                console.log('疾病症状提交成功!');
                if(data.probabilityList.length==0){
                    $('.main_content').prepend('<div class="noResult">无相关匹配结果，请进行更精确的选择</div>');
                    $('#tcmt').css('display','none')
                    $('.submit').html('返回上一步');
                    $('.submit').attr('href','javascript:history.go(-1)');
                    $('.submit').removeClass('link')
                }
                else{
                    $('.disease').css('display','block');
                    console.log('疾病length:',data.probabilityList.length);
                    console.log('疾病probabilityList:',data.probabilityList);

                    //自动触发第一项百分比 获取第一个li的id
                    console.log('_id:',data.probabilityList[0].diseaseId._id);
                    var curId=data.probabilityList[0].diseaseId._id;
                    $.ajax({
                        type:'post',
                        url:'/disease_symptom/diseaseDiagnoseDetail',
                        data:{diseaseId:curId,chosenSymptom:diseaseStr},
                        success:function(data){
                            if (data.errcode == 0) {
                                //匹配症状
                                if(data.matchSymptom!=''){
                                    var liHtml1='';
                                    $.each(data.matchSymptom,function(i,item){
                                        liHtml1+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                                        $('#disease .suit_symptom .lists').html(liHtml1);
                                    })
                                }else{
                                    $('#disease .suit_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //不匹配症状
                                if(data.mismatchSymptom!=''){
                                    var liHtml2='';
                                    $.each(data.mismatchSymptom,function(i,item){
                                        liHtml2+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                                        $('#disease .unsuit_symptom .lists').html(liHtml2);
                                    })
                                }else{
                                    $('#disease .unsuit_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //参考症状
                                if(data.otherSymptom!=''){
                                    var liHtml3='';
                                    $.each(data.otherSymptom,function(i,item){
                                        liHtml3+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                                        $('#disease .reference_symptom .lists').html(liHtml3);
                                    })
                                }else{
                                    $('#disease .reference_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //鉴别诊断
                                $('#disease .content').html(data.antidiastole)

                                //触发中医分型的面板
                                $.ajax({
                                    type:'post',
                                    url:'/tcmt_syndrome/diagnoseTcmt',
                                    data:{userId:sessionStorage['id'],chosenSyndrome:tcmtStr,recordId:recordId,diseaseId:$('#disease .cur').attr('id')},
                                    success:function(data){
                                        if(data.errcode == 0) {
                                            console.log('触发中医分型的面板');
                                            console.log('分型列表:--------',data.probabilityList);
                                            if(data.probabilityList.length==0){
                                            $('#tcmt .area').html('<div class="noResult" style="background: #fff">无相关匹配结果，请进行更精确的选择</div>');
                                                //$('#tcmt .main_content').prepend('<div class="noResult">无相关匹配结果，请进行更精确的选择</div>');
                                                $('#tcmt .submit').html('返回上一步');
                                                $('#tcmt .submit').attr('href','javascript:history.go(-1)');
                                                $('.submit').removeClass('link')
                                            }
                                            else if(data.probabilityList.length!=0){
                                                $('#tcmt .submit').css('display','block');
                                                $('#tcmt .back').css('display','none');
                                                $('#tcmt .tcmt').css('display','block');
                                                console.log('分型length:',data.probabilityList.length);
                                                console.log('分型probabilityList:',data.probabilityList);
                                                var liHtml='';
                                                $.each(data.probabilityList,function(i,item){
                                                    liHtml+=`<li id=${item.tcmtId._id}><b class="percent">${item.probability}%</b><span class="t_percent">${item.tcmtId.tcmtName}</span></li>`
                                                })
                                                $('.percentsTcmt').html(liHtml);
                                                console.log('---------所有li',$('.percentsTcmt li'));
                                                console.log("--------百分比$('.percentsTcmt li').eq(0)",$('.percentsTcmt li').eq(0));
                                                $('.percentsTcmt li').eq(0).addClass('cur');

                                                //自动触发第一项百分比 获取第一个li的id
                                                console.log(data,"--data---");
                                                var curId=data.probabilityList[0].tcmtId._id;
                                                console.log('触发中医分型详情diseaseId:',$('#disease .cur').attr('id'));
                                                console.log('触发中医分型详情tcmtId:',curId);
                                                $.ajax({
                                                    type:'post',
                                                    url:'/tcmt_syndrome/tcmtDiagnoseDetail',
                                                    data:{tcmtId:curId,chosenSyndrome:tcmtStr,diseaseId: $('#disease .cur').attr('id')},
                                                    success:function(data){
                                                        if (data.errcode == 0) {
                                                            //匹配症状
                                                            if(data.matchSyndrome!=''){
                                                                var liHtml1='';
                                                                $.each(data.matchSyndrome,function(i,item){
                                                                    liHtml1+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                                                    $('#tcmt .suit_symptom .lists').html(liHtml1);
                                                                })
                                                            }else{
                                                                $('#tcmt .suit_symptom .lists').html('<li>无相关症状</li>');
                                                            }

                                                            //不匹配症状
                                                            if(data.mismatchSyndrome!=''){
                                                                var liHtml2='';
                                                                $.each(data.mismatchSyndrome,function(i,item){
                                                                    liHtml2+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                                                    $('#tcmt .unsuit_symptom .lists').html(liHtml2);
                                                                })
                                                            }else{
                                                                $('#tcmt .unsuit_symptom .lists').html('<li>无相关症状</li>');
                                                            }

                                                            //参考症状
                                                            if(data.otherSyndrome!=''){
                                                                var liHtml3='';
                                                                $.each(data.otherSyndrome,function(i,item){
                                                                    liHtml3+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                                                    $('#tcmt .reference_symptom .lists').html(liHtml3);
                                                                })
                                                            }else{
                                                                $('#tcmt .reference_symptom .lists').html('<li>无相关症状</li>');
                                                            }

                                                            //鉴别诊断
                                                            $('#tcmt .content').html(data.treatmentDetail)

                                                        }
                                                    }
                                                })


                                                //存储选中的diseaseId
                                                //var dId=$('.percents li.cur').attr('id');
                                                console.log('``````````当前的tcmtId:``````',curId);
                                                sessionStorage.setItem('tcmtId', curId);
                                            }
                                        }
                                    }.bind(this)
                                })
                            }

                        }
                    })

                    var liHtml='';
                     $.each(data.probabilityList,function(i,item){
                         console.log(item);
                        liHtml+=`<li id=${item.diseaseId._id}><b class="percent">${item.probability}%</b><span class="t_percent">${item.diseaseId.diseaseName}</span></li>`
                 })
                 $('.percents').html(liHtml);
                    console.log("-----.percents$('.percents li').eq(0)",$('.percents li').eq(0));
                    $('.percents li').eq(0).addClass('cur');
                    //存储选中的diseaseId
                    //var dId=$('.percents li.cur').attr('id');
                    console.log('``````````当前的的dId:``````',curId);
                    sessionStorage.setItem('dId', curId);
                }
            }
        }

    })
});
//中医分型部分代码
var diseaseId=sessionStorage['dId'];

//疾病诊断点击百分比  切换面板
$('.percents').on('click','li',function(){
    console.log('当前的diseaseId',$(this).attr('id'));
    sessionStorage.setItem('dId',$(this).attr('id'));
    $.ajax({
        type:'post',
        url:'/disease_symptom/diseaseDiagnoseDetail',
        data:{diseaseId:$(this).attr('id'),chosenSymptom:diseaseStr},
        success:function(data){
            if (data.errcode == 0) {
                console.log('data',data);
                //匹配症状
                if(data.matchSymptom!=''){
                    var liHtml1='';
                    $.each(data.matchSymptom,function(i,item){
                        liHtml1+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                        $('#disease .suit_symptom .lists').html(liHtml1);
                        })
                }else{
                    $('#disease .suit_symptom .lists').html('<li>无相关症状</li>');
                }

                //不匹配症状
                if(data.mismatchSymptom!=''){
                    var liHtml2='';
                    $.each(data.mismatchSymptom,function(i,item){
                        liHtml2+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                        $('#disease .unsuit_symptom .lists').html(liHtml2);
                    })
                }else{
                    $('#disease .unsuit_symptom .lists').html('<li>无相关症状</li>');
                }

                //参考症状
                if(data.otherSymptom!=''){
                    var liHtml3='';
                    $.each(data.otherSymptom,function(i,item){
                        liHtml3+=`<li><b>${i+1}</b><span id=${item.symptomId}>${item.symptom}</span></li>`;
                        $('#disease .reference_symptom .lists').html(liHtml3);
                    })
                }else{
                    $('#disease .reference_symptom .lists').html('<li>无相关症状</li>');
                }

                //鉴别诊断
                $('#disease .content').html(data.antidiastole);
        }
        }
    })
    $(this).addClass('cur').siblings('.cur').removeClass('cur');
    console.log('分型列表传的diseaseId',$('#disease .cur').attr('id'));
    //触发中医分型的面板
    $.ajax({
        type:'post',
        url:'/tcmt_syndrome/diagnoseTcmt',
        data:{userId:sessionStorage['id'],chosenSyndrome:tcmtStr,recordId:recordId,diseaseId:$('#disease .percents .cur').attr('id')},
        success:function(data){
            if(data.errcode == 0) {
                console.log('切换病种可能性触发中医分型的面板');
                console.log('切换病种可能性触发中医分型的面板分型列表数据:--------',data.probabilityList);
                if(data.probabilityList.length==0){
                    //$('#tcmt .main_content').prepend('<div class="noResult">无相关匹配结果，请进行更精确的选择</div>');
                    $('#tcmt .area').html('<div class="noResult" style="background: #fff">无相关匹配结果，请进行更精确的选择</div>');
                    $('#tcmt .submit').html('返回上一步');
                    $('#tcmt .submit').attr('href','javascript:history.go(-1)');
                    $('.submit').removeClass('link');
                }
                else if(data.probabilityList.length!=0){
                    $('#tcmt .submit').css('display','block');
                    $('#tcmt .back').css('display','none');
                    $('#tcmt .tcmt').css('display','block');
                    console.log('分型length:',data.probabilityList.length);
                    console.log('分型probabilityList:',data.probabilityList);
                    var liHtml='';
                    $.each(data.probabilityList,function(i,item){
                        liHtml+=`<li id=${item.tcmtId._id}><b class="percent">${item.probability}%</b><span class="t_percent">${item.tcmtId.tcmtName}</span></li>`
                    })
                    $('.percentsTcmt').html(liHtml);
                    console.log('百分比');
                    $('.percentsTcmt li').eq(0).addClass('cur');

                    //自动触发第一项百分比 获取第一个li的id
                    console.log(data,"--data---");
                    var curId=data.probabilityList[0].tcmtId._id;
                    console.log('触发中医分型详情diseaseId:',$(this).attr('id'));
                    console.log('触发中医分型详情tcmtId:',curId);
                    $.ajax({
                        type:'post',
                        url:'/tcmt_syndrome/tcmtDiagnoseDetail',
                        data:{tcmtId:curId,chosenSyndrome:tcmtStr,diseaseId: $(this).attr('id')},
                        success:function(data){
                            if (data.errcode == 0) {
                                console.log('点击了li');
                                //匹配症状
                                if(data.matchSyndrome!=''){
                                    var liHtml1='';
                                    $.each(data.matchSyndrome,function(i,item){
                                        liHtml1+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                        $('#tcmt .suit_symptom .lists').html(liHtml1);
                                    })
                                }else{
                                    $('#tcmt .suit_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //不匹配症状
                                if(data.mismatchSyndrome!=''){
                                    var liHtml2='';
                                    $.each(data.mismatchSyndrome,function(i,item){
                                        liHtml2+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                        $('#tcmt .unsuit_symptom .lists').html(liHtml2);
                                    })
                                }else{
                                    $('#tcmt .unsuit_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //参考症状
                                if(data.otherSyndrome!=''){
                                    var liHtml3='';
                                    $.each(data.otherSyndrome,function(i,item){
                                        liHtml3+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                        $('#tcmt .reference_symptom .lists').html(liHtml3);
                                    })
                                }else{
                                    $('#tcmt .reference_symptom .lists').html('<li>无相关症状</li>');
                                }

                                //鉴别诊断
                                $('#tcmt .content').html(data.treatmentDetail)

                            }
                        }
                    })


                    //存储选中的diseaseId
                    //var dId=$('.percents li.cur').attr('id');
                    console.log('tcmtId:',curId);
                    sessionStorage.setItem('tcmtId', curId);
                }
            }
        }.bind(this)
    });
    console.log('点击疾病列表,保存did');
    sessionStorage.setItem('dId', $(this).attr('id'));
})

//中医分型点击百分比
//点击百分比  切换面板
$('.percentsTcmt').on('click','li',function(){
    console.log('我点击了中医分型的li');
    console.log('我传递的diseaseId----',$('#disease .cur').attr('id'));
    console.log('我传递的tcmtId----',$(this).attr('id'));
    console.log('我传递的chosenSyndrome----',tcmtStr);
    $.ajax({
        type:'post',
        url:'/tcmt_syndrome/tcmtDiagnoseDetail',
        data:{tcmtId:$(this).attr('id'),chosenSyndrome:tcmtStr,diseaseId: $('#disease .cur').attr('id')},
        success:function(data){
            if (data.errcode == 0) {
                console.log('点击了li');
                //匹配症状
                if(data.matchSyndrome!=''){
                    var liHtml1='';
                    $.each(data.matchSyndrome,function(i,item){
                        liHtml1+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                        $('#tcmt .suit_symptom .lists').html(liHtml1);
                    })
                }else{
                    $('#tcmt .suit_symptom .lists').html('<li>无相关症状</li>');
                }

                //不匹配症状
                if(data.mismatchSyndrome!=''){
                    var liHtml2='';
                    $.each(data.mismatchSyndrome,function(i,item){
                        liHtml2+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                        $('#tcmt .unsuit_symptom .lists').html(liHtml2);
                    })
                }else{
                    $('#tcmt .unsuit_symptom .lists').html('<li>无相关症状</li>');
                }

                //参考症状
                if(data.otherSyndrome!=''){
                    var liHtml3='';
                    $.each(data.otherSyndrome,function(i,item){
                        liHtml3+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                        $('#tcmt .reference_symptom .lists').html(liHtml3);
                    })
                }else{
                    $('#tcmt .reference_symptom .lists').html('<li>无相关症状</li>');
                }

                //鉴别诊断
                $('#tcmt .content').html(data.treatmentDetail)

            }
        }
    })
    $(this).addClass('cur').siblings('.cur').removeClass('cur');
    console.log('保存当前的tcmtId');
    sessionStorage.setItem('tcmtId', $(this).attr('id'));
})
