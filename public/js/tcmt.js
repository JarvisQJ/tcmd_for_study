/**
 * Created by Administrator on 2017/5/2.
 */
//获取tcmt
var tcmtStr=sessionStorage['tcmtStr'];
var recordId=sessionStorage['recordId'];
var diseaseId=sessionStorage['dId'];
console.log(tcmtStr);
console.log(recordId);
console.log(diseaseId);
$(function(){
    $.ajax({
        type:'post',
        url:'/tcmt_syndrome/diagnoseTcmt',
        //,'diseaseId':$('.percents .cur').attr('id')
        data:{userId:1,chosenSyndrome:tcmtStr,recordId:recordId,diseaseId:diseaseId},
        success:function(data){
           if(data.errcode == 0) {
                console.log('中医分型症状提交成功');
               console.log(data.probabilityList);
               if(data.probabilityList.length==0){
                   $('.main_content').prepend('<div class="noResult">无相关匹配结果，请进行更精确的选择</div>');
                   $('.submit').html('返回上一步');
                   $('.submit').attr('href','javascript:history.go(-1)')
               }
               else{
                   $('.submit').css('display','block');
                   $('.back').css('display','none');
                   $('.tcmt').css('display','block');
                   console.log('length:',data.probabilityList.length);
                   console.log('probabilityList:',data.probabilityList);

                   //自动触发第一项百分比 获取第一个li的id
                   console.log(data,"--data---");
                   var curId=data.probabilityList[0].tcmtId._id;
                   $.ajax({
                       type:'post',
                       url:'/tcmt_syndrome/tcmtDiagnoseDetail',
                       data:{tcmtId:curId,chosenSyndrome:tcmtStr,diseaseId:diseaseId},
                       success:function(data){
                           if (data.errcode == 0) {
                               console.log('点击了li');
                               //匹配症状
                               if(data.matchSyndrome!=''){
                                   var liHtml1='';
                                   $.each(data.matchSyndrome,function(i,item){
                                       liHtml1+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                       $('.suit_symptom .lists').html(liHtml1);
                                   })
                               }else{
                                   $('.suit_symptom .lists').html('<li>无相关症状</li>');
                               }

                               //不匹配症状
                               if(data.mismatchSyndrome!=''){
                                   var liHtml2='';
                                   $.each(data.mismatchSyndrome,function(i,item){
                                       liHtml2+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                       $('.unsuit_symptom .lists').html(liHtml2);
                                   })
                               }else{
                                   $('.unsuit_symptom .lists').html('<li>无相关症状</li>');
                               }

                               //参考症状
                               if(data.otherSyndrome!=''){
                                   var liHtml3='';
                                   $.each(data.otherSyndrome,function(i,item){
                                       liHtml3+=`<li><b>${i+1}</b><span id=${item.syndromeId}>${item.syndrome}</span></li>`;
                                       $('.reference_symptom .lists').html(liHtml3);
                                   })
                               }else{
                                   $('.reference_symptom .lists').html('<li>无相关症状</li>');
                               }

                               //鉴别诊断
                               $('.content').html(data.treatmentDetail)

                           }
                       }
                   })

                   var liHtml='';
                   $.each(data.probabilityList,function(i,item){
                       liHtml=`<li id=${item.tcmtId._id} class="cur"><b class="percent">${item.probability}%</b><span class="t_percent">${item.tcmtId.tcmtName}</span></li>`
                   })
                   $('.percentsTcmt').html(liHtml);
                   console.log('百分比');
                   $('.percentsTcmt li').eq(0).addClass('cur');
                   //存储选中的diseaseId
                   //var dId=$('.percents li.cur').attr('id');
                   console.log('tcmtId:',curId);
                   sessionStorage.setItem('tcmtId', curId);
               }
            }
        }

    })
})

