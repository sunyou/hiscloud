//处方笺
$(function() {
//	$('#typecor').corner('100px');
});

//查看处方笺
function prescriptionShow(ordid){
	$('#prescriptionDlg').dialog('open').dialog('center');
//	window.open($WEB_ROOT_PATH+'/mainPage/mainPageCtrl.htm?BLHMI=prescription');
	postReq($WEB_ROOT_PATH+'/searchOrd/prescriptionSearch.ajax',
			'',function(msg){
		 if(msg.rows.length){
			$('#ordid').html(ordid);
			$('#division').html(msg.rows[0].orgname);
			$('#feeSort').html(msg.rows[0].patientIdentityname);
			$('#outpatientNO').html(msg.rows[0].admisSerialno);
			$('#ordOfYear').html(msg.rows[0].ordDate.split("-")[0]);
			$('#ordOfMonth').html(msg.rows[0].ordDate.split("-")[1]);
			$('#ordOfDay').html(msg.rows[0].ordDate.split("-")[2].substring(0,2));
			$('#patientName').html(msg.rows[0].patientName);
			$('#patientAge').html(msg.rows[0].birthDate);
			$('#patientGender').html(msg.rows[0].patientSexId);
			$('#clinicalDiagnosis').html(msg.rows[0].diagName);
			var html = "";
			if(msg.rows[0].ordTypeid==00){
				for(var i=0; i<msg.rows.length; i++){
					html += "<tr height='30px;'>" +
					"<td valign='top'>"+msg.rows[i].itemname+"</td>" +
					"<td valign='top'>"+msg.rows[i].itemspec+"</td>" +
					"<td valign='top'>"+msg.rows[i].usagename+"</td>" +
					"<td valign='top'>"+msg.rows[i].freqName+"</td>" +
					"<td valign='top'>"+msg.rows[i].perQuantity+msg.rows[0].medunitName+"</td>" +
					"<td valign='top'>"+msg.rows[i].freqquantity+msg.rows[0].frequnit+"</td>" +
					"</tr>";
				}	
			}else{
				for(var i=0; i<msg.rows.length; i++){
					html += "<tr height='30px;'>" +
					"<td valign='top'>"+msg.rows[i].itemname+"</td>" +
					"<td valign='top'>"+msg.rows[i].usagename+"</td>" +
					"<td valign='top'>"+msg.rows[i].permedQuantity+"g</td>" +
					"</tr>";
				}	
			}
			$('#prescriptionDetail').html(html);
			$('#docName').html(msg.rows[0].empnameDoct);
			$('#ckName').html(msg.rows[0].empnameDoct);
			var amountTotal=0; 
			for(var i=0; i<msg.rows.length; i++){
				amountTotal = amountTotal + msg.rows[i].amountTotal;
			}
			$('#medicinePrice').html(amountTotal);
		 }
	},function(){},{},{"ordid":ordid});
}
//关闭处方笺弹窗
function closePrescription() {
	$('#prescriptionDlg').dialog('close');
}
//打印处方笺
function printPrescription(){
	var ordid = $('#ordid').text();
	window.open($WEB_ROOT_PATH+'/mainPage/mainPageCtrl.htm?BLHMI=prescription&'+ordid+'');
}
