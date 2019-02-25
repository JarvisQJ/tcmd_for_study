


var docName=sessionStorage['docName'];
 var id=sessionStorage['id'];

$('.userName').html(docName);
//0
$('.Login').click(function(){
  location.href='loginPage';
})

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]); return null;
}
