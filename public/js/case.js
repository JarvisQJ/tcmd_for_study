/**
 * Created by Administrator on 2017/5/2.
 */

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]); return null;
}
//提取病历详情
var recordId=GetQueryString('recordId');
var diseaseId=sessionStorage['dId'];
var tcmtId=sessionStorage['tcmtId'];
//console.log(recordId);
$(function(){
    //加载病人个人资料！
    $.ajax({
        type:'get',
        url:'/record/completeRecord?recordId='+recordId+'&diseaseId='+diseaseId+'&tcmtId='+tcmtId,
        success:function(data) {
            $('.realName').html(data.record.realName);
            $('.gender').html(data.record.gender);
            $('.phoneNo').html(data.record.phoneNo);
            $('.age').html(data.record.age);
            $('.idCardNo').html(data.record.idCardNo);
            $('.occupation').html(data.record.occupation);
            $('.address').html(data.record.address);
            $('.presentIllnessHistory').html(data.record.presentIllnessHistory);
            $('.personalIllnessHistory').html(data.record.personalIllnessHistory);
            $('.previousIllnessHistory').html(data.record.previousIllnessHistory);
            $('.familyIllnessHistory').html(data.record.familyIllnessHistory);
            $('.chiefComplaint').html(data.record.chiefComplaint);

            var diseaseLi='';
            var tcmtLi='';
            //疾病诊断
            $.each(data.record.diagnosisSymptom,function(i,item){
                diseaseLi+=`<li><i>${i+1}</i><span>${item.symptom}</span></li>`;
            })
            $('#panel1 .det').html(diseaseLi);

            //中医分型
            $.each(data.record.diagnosisSyndrome,function(i,item){
                tcmtLi+=`<li><i>${i+1}</i><span>${item.syndrome}</span></li>`
            })
            $('#panel2 .det').html(tcmtLi);
            $('.treatment_det').html(data.record.treatmentDetail)
        }

    })
})