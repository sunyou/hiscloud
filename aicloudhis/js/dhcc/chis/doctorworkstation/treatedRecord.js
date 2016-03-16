//历次就诊记录部分
$(function() {
	var url = '';
	var columns = [[
	  	        {field:'admisSerialno',title:'就诊流水号',hidden:true},
		        {field:'admisDatetime',title:'接诊时间',width:63,align:'center'},    
		        {field:'diagName',title:'诊断',width:153,align:'center'}, 
		        {field:'empnameAdmis',title:'医生',width:63,align:'center'}, 
		    ]];
	var pageOpts = {pageNumber : 1,pageSize : 10};
	var sortOpts = {remoteSort : false};
	var options = {fitColumns: true,
				    showGroup: true,
				    pagination: true,
					singleSelect: true,
					rownumbers: true,
					showFooter: true,
					scrollbarSize:0,
					height:420,
					onSelect:function(){},//为了防止与病历模版冲突
					onClickRow:showDetail};
	var queryParams = {page : 1,rows : 10};
	$CommonUI.datagrid('#historyDataGrid', url, queryParams, columns, pageOpts, sortOpts,options);
});
//打开历次就诊记录
function openDetailsDlg(){
	$('#DetailsDlg').panel('resize',{
		width: $(window).width()-20,
		height: 460
	});
	$('#DetailsDlg').dialog('open').dialog('center').dialog('move',{"top": "30"});
	
}


//历次就诊tab
var tabsResizeOnSelect=function(title,index){
	if(index==0) {
		parent.closeTemplate();
		//$CommonUI.getLinkButton('#saveTemplate').linkbutton({text:'收藏为病历模板'});
		//$CommonUI.getLinkButton('#sendToFee').linkbutton('disable');
		//$CommonUI.getLinkButton('#saveTemplate').linkbutton('enable');
		$('#saveTemplate').html(' 收藏为病历模板 ');
		$('#saveBtn').html(' 保存病历 ');
		$('#sendToFee').attr('disabled','disabled');
		$('#saveBtn').removeAttr('disabled');
		$('#saveTemplate').removeAttr('disabled');
		$('#importTemplate').removeAttr('disabled');
	} else if(index==1) {
		var patientid=$('#hiddenpatientId').val();
		if(patientid==""||patientid=="undefined"){
			$CommonUI.alert("请先选择一个患者,开立诊断");
			$CommonUI.getTabs('#tabsResize').tabs('select',0);
			//$CommonUI.getLinkButton('#saveTemplate').linkbutton({text:'收藏为病历模板'});
			//$CommonUI.getLinkButton('#sendToFee').linkbutton('disable');
			$('#saveTemplate').html('收藏为病历模板');
			$('#sendToFee').attr('disabled','disabled');
			$('#saveBtn').removeAttr('disabled');
			$('#saveTemplate').removeAttr('disabled');
			$('#importTemplate').removeAttr('disabled');
			return;
		}else{
			parent.showTemplate();
			//$CommonUI.getLinkButton('#saveTemplate').linkbutton({text:'收藏为医嘱模板'});
			//$CommonUI.getLinkButton('#sendToFee').linkbutton('enable');
			//$CommonUI.getLinkButton('#saveTemplate').linkbutton('enable');
			$('#saveTemplate').html(' 收藏为医嘱模板 ');
			$('#saveBtn').html(' 保存医嘱 ');
			$('#sendToFee').removeAttr('disabled','disabled');
			$('#saveBtn').removeAttr('disabled');
			$('#saveTemplate').removeAttr('disabled');
			$('#importTemplate').removeAttr('disabled');
		}
	} else if(index==2) {
		var patientid=$('#hiddenpatientId').val();//患者ID
		if(patientid==""||patientid=="undefined"){
			$CommonUI.alert("请先选择一个患者");
			$CommonUI.getTabs('#tabsResize').tabs('select',0);
			//$CommonUI.getLinkButton('#saveTemplate').linkbutton({text:'收藏为病历模板'});
			//$CommonUI.getLinkButton('#sendToFee').linkbutton('disable');
			$('#saveTemplate').html('收藏为病历模板');
			$('#saveBtn').html(' 保存病历 ');
			$('#sendToFee').attr('disabled','disabled');
			$('#saveBtn').removeAttr('disabled');
			$('#saveTemplate').removeAttr('disabled');
			$('#importTemplate').removeAttr('disabled');
			return;
		}else{
			parent.closeTemplate();
			//$CommonUI.getLinkButton('#saveTemplate').linkbutton('disable');
			//$CommonUI.getLinkButton('#sendToFee').linkbutton('enable');
			$('#sendToFee').removeAttr('disabled');
			$('#saveTemplate').attr('disabled','disabled');
			$('#saveBtn').attr('disabled','disabled');
			$('#importTemplate').attr('disabled','disabled');
		}
	};
};

//历次就诊对话框（历次就诊详细）
function viewDetails(admisSerialno){
	$CommonUI.getWindow('#DetailsDlg').window('open');
	$.getJSON($WEB_ROOT_PATH+ "/patientRecords/patientRecordsCtrl.htm?BLHMI=viewDetail",
			{"dto.paadm.admisSerialno":admisSerialno},
			function(d) {
				if(d["rows"] !=0) {
					$('#DetailsName').html(d["rows"][0].patientName);//患者姓名
					$('#DetailsGender').html(d["rows"][0].patientSexId);//患者性别
					$('#DetailsAge').html(d["rows"][0].age);//年龄
					$('#DetailsPhone').html(d["rows"][0].patientTelephone);//联系电话
					if(d["rows"][0].ctAddr == null || d["rows"][0].ctAddr == "") {
						$("#addr").css('display', 'none');
					}else{
						$("#addr").css('display', 'inline-block');
						$('#DetailsAddress').html(d["rows"][0].ctAddr);//地址
					}
					$('#DetailsSerialno').val(d["rows"][0].admisSerialno);//就诊序号
					$('#DetailsDoctor').val(d["rows"][0].empnameAdmis);//就诊医生
					$('#DetailsTime').val(d["rows"][0].admisDatetime);//就诊时间
					for (var i=0; i< d["total"]; i++) {
						if(d["rows"][0].appendTypeid != null) {
							if (d["rows"][i].appendTypeid==01) {
								$('#DetailsComplaint').val(d["rows"][i].appendContent);//主诉
							} else if(d["rows"][i].appendTypeid==02) {
								$('#DetailsHistory').val(d["rows"][i].appendContent);//现病史
							} else if(d["rows"][i].appendTypeid==03) {
								$('#DetailsTemperature').val(d["rows"][i].appendContent);//体温
							} else if(d["rows"][i].appendTypeid==04) {
								$('#DetailsHeartRate').val(d["rows"][i].appendContent);//心率
							} else if(d["rows"][i].appendTypeid==05) {
								$('#DetailsSBP').val(d["rows"][i].appendContent);//收缩压
							} else if(d["rows"][i].appendTypeid==06) {
								$('#DetailsDBP').val(d["rows"][i].appendContent);//舒张压
							} else if(d["rows"][i].appendTypeid==07) {//心律
								var data = d["rows"][i].appendContent;
								if(data == 01){
									$('#DetailsRhythm').val("心律齐");
								}else if(data == 02){
									$('#DetailsRhythm').val("心律不齐");
								}else if(data == 03){
									$('#DetailsRhythm').val("绝对不齐");
								}								
							}else if(d["rows"][i].appendTypeid==08) {
								$('#DetailsOther').val(d["rows"][i].appendContent);//其他
							}
						} else {//没有这些信息，初始化
							$('#DetailsComplaint').val("");//主诉
							$('#DetailsHistory').val("");//现病史
							$('#DetailsTemperature').val("");//体温
							$('#DetailsHeartRate').val("");//心率
							$('#DetailsSBP').val("");//收缩压
							$('#DetailsDBP').val("");//舒张压
							$('#DetailsRhythm').val("");//心律
							$('#DetailsOther').val("");//其他
						}
					}
				}
			});
	$CommonUI.getDataGrid('#historyOrders').datagrid({  
	    url:$WEB_ROOT_PATH+'/searchOrd/listOrder.ajax',
	    pagination: true,
	    fitColumns:true,
	    singleSelect:true,
	    queryParams:{
	    	"admisSerialno":admisSerialno
	    },
	    columns:[[
	        {field:'ordid',title:'医嘱Id',width:100,hidden:true,align:'center'},
	        {field:'ordName',title:'医嘱名称',width:100,align:'center'},  
	        {field:'rekStatus',title:'结算状态',width:100,align:'center'},  
	        {field:'orgnameExec',title:'接收科室',width:100,align:'center'},
	        {field:'ordDate',title:'开立时间',width:100,align:'center'},
	        {field:'empnameDoct',title:'医生',width:100,align:'center'},
	        {field:'action',title:'操作',width:100,align:'center',formatter: function(value,row,index){
	        	var e = '<a href="#" onclick="viewOrderAction(\''+row.ordid+'\','+row.ordTypeid+',\''+row.note+'\','+row.timesQuantity+')" style="margin:0 5px">查看详细</a>';
	        	return e; 
	        }}
	    ]]
	});
}
//历次就诊详细医嘱详细查看
function viewOrderAction(ordid,ordTypeid,note,timesQuantity){
	if(ordTypeid=='0'){
		$CommonUI.getTabs('#tabsOrderDetail').tabs('select',0);
		var url=$WEB_ROOT_PATH+'/westernMedicine/westernMedicineCtrl.htm?BLHMI=listSub';
		postReq(url,'wstmedcDetail',function(msg){
			$("#wstMedordid").val(ordid);
			$('#historyOrdersDg').datagrid('loadData',msg);
		},function(){},{},{"dto.tord.ordid":ordid});
	}else if(ordTypeid=='1'){
		$CommonUI.getTabs('#tabsOrderDetail').tabs('select',1);
		var url=$WEB_ROOT_PATH+'/chineseMedicine/chineseMedicineCtrl.htm?BLHMI=listSub';
		postReq(url,'',function(msg){
			$("#cnMedordidDetail").val(ordid);
			$("input[name='dto.tord.note']").val(note);
			$("#cnMedTQDetail").combobox('setValue',timesQuantity);
			$('#cnMedicineDg').datagrid('loadData',msg);
			$('#cnMedOrgnameExecDetail').combobox('setValue',msg["rows"][0].orgnameExec);
			$('#cnMedOrgidExecDetail').val(msg["rows"][0].orgidExec);
			$('#cnMedFrequencyDetail').combobox('setValue',msg["rows"][0].freqid);
			$('#cnMedUsagenameDetail').combobox('setValue',msg["rows"][0].usagename);
			$('#cnMedUsageidDetail').val(msg["rows"][0].usageid);
		},function(){},{},{"dto.tord.ordid":ordid});
	}else{
		$CommonUI.getTabs('#tabsOrderDetail').tabs('select',2);
		var url=$WEB_ROOT_PATH+'/inspection/inspectionCtrl.htm?BLHMI=listSub';
		postReq(url,'',function(msg){
			$('#inspectionDgDetail').datagrid('loadData',msg);
		},function(){},{},{"dto.order.ordid":ordid});
	}
};
function showDetail(index,rowData) {
	$.getJSON($WEB_ROOT_PATH+ "/treatment/diagDetail.ajax",
			{"admisSerialno":rowData.admisSerialno},function(msg){
				if(msg["total"] !=0) {
					var html="";
					for(var i=0; i<msg["total"]; i++) {
						html+=msg["rows"][i].diagName+"&nbsp;&nbsp;&nbsp;";
					}
					$('#DetailsDiagnoses').html(html);
				} else {
					$('#DetailsDiagnoses').html("");
				}
	});
	$.getJSON($WEB_ROOT_PATH+ "/patientRecords/patientRecordsCtrl.htm?BLHMI=viewDetail",
			{"dto.paadm.admisSerialno":rowData.admisSerialno},
			function(d) {
				if(d["rows"] !=0) {
					$('#DetailsName').html(d["rows"][0].patientName);//患者姓名
					$('#DetailsGender').html(d["rows"][0].patientSexId);//患者性别
					$('#DetailsAge').html(d["rows"][0].age);//年龄
					$('#DetailsPhone').html(d["rows"][0].patientTelephone);//联系电话
					$('#DetailsAddress').html(d["rows"][0].ctAddr);//地址
					$('#DetailsSerialno').html(d["rows"][0].admisSerialno);//就诊序号
					$('#DetailsDoctor').html(d["rows"][0].empnameAdmis);//就诊医生
					$('#DetailsTime').html(d["rows"][0].admisDatetime);//就诊时间
					for (var i=0; i< d["total"]; i++) {
						if(d["rows"][0].appendTypeid != null) {
							if (d["rows"][i].appendTypeid==01) {
								$('#DetailsComplaint').html("&nbsp;&nbsp;&nbsp;&nbsp;"+d["rows"][i].appendContent);//主诉
							} else if(d["rows"][i].appendTypeid==02) {
								$('#DetailsHistory').html("&nbsp;&nbsp;&nbsp;&nbsp;"+d["rows"][i].appendContent);//现病史
							} else if(d["rows"][i].appendTypeid==03) {
								$('#DetailsTemperature').html(d["rows"][i].appendContent);//体温
							} else if(d["rows"][i].appendTypeid==04) {
								$('#DetailsHeartRate').html(d["rows"][i].appendContent);//心率
							} else if(d["rows"][i].appendTypeid==05) {
								$('#DetailsSBP').html(d["rows"][i].appendContent);//收缩压
							} else if(d["rows"][i].appendTypeid==06) {
								$('#DetailsDBP').html(d["rows"][i].appendContent);//舒张压
							} else if(d["rows"][i].appendTypeid==07) {//心律
								var data = d["rows"][i].appendContent;
								if(data == 01){
									$('#DetailsRhythm').html("心律齐");
								}else if(data == 02){
									$('#DetailsRhythm').html("心律不齐");
								}else if(data == 03){
									$('#DetailsRhythm').html("绝对不齐");
								}								
							}else if(d["rows"][i].appendTypeid==08) {
								$('#DetailsOther').html(d["rows"][i].appendContent);//其他
							}
						} else {//没有这些信息，初始化
							$('#DetailsComplaint').html("");//主诉
							$('#DetailsHistory').html("");//现病史
							$('#DetailsTemperature').html("");//体温
							$('#DetailsHeartRate').html("");//心率
							$('#DetailsSBP').html("");//收缩压
							$('#DetailsDBP').html("");//舒张压
							$('#DetailsRhythm').html("");//心律
							$('#DetailsOther').html("");//其他
						}
					}
				}
			});
	$.getJSON($WEB_ROOT_PATH+ "/patientRecords/patientRecordsCtrl.htm?BLHMI=ordSubs",{"dto.admisSerialno":rowData.admisSerialno},function(d){
		var html='';
		if(d["total"]!=0) {
			html+='<tr><td align="left">医嘱类型</td>'
					  +'<td align="center">药品名称</td>'
					  +'<td align="center">用法</td>'
					  +'<td align="center">付数</td>'
					  +'<td align="center">每次剂量数</td>'
					  +'<td align="center">使用频次</td>'
					  +'<td align="center">疗程数</td>'
				+'</tr>';
			for(var i=0; i<d["total"]; i++){
				 html+='<tr>';
				 html+='<td width="80"align="left">'+d["rows"][i].ordName+'</td>';
		       	 html+='<td width="(d["rows"][i].itemname).length*20"align="left">'+d["rows"][i].itemname+'</td>';
		       	 if(d["rows"][i].usagename!=null) {
		       		html+='<td width="(d["rows"][i].itemname).length*20"align="left" align="center">'+d["rows"][i].usagename+'</td>';
		       	 }else{
		       		html+='<td width="40"align="center">/</td>';
		       	 }
		       	 if(d["rows"][i].timesQuantity!=null && d["rows"][i].timesQuantity!=0) {
		       		 html+='<td width="40"align="center">'+d["rows"][i].timesQuantity+'</td>';
		       	 }else{
		       		 html+='<td width="40"align="center">/</td>';
		       	 }
		       	 if(d["rows"][i].permedQuantity!=null && d["rows"][i].permedQuantity!=0) {
		       		html+='<td width="60"align="center">'+d["rows"][i].permedQuantity+'</td>';
				 }else {
					 html+='<td width="60"align="center">/</td>';
				 }
		       	if(d["rows"][i].freqid!=null) {
		       		html+='<td width="50"align="center">'+d["rows"][i].freqid+'</td>';
				 }else {
					 html+='<td width="50"align="center">/</td>';
				 }
		       	if(d["rows"][i].freqquantity!=null) {
		       		html+='<td width="40"align="center">'+d["rows"][i].freqquantity+d["rows"][i].frequnit+'</td>';
				 }else {
					 html+='<td width="40"align="center">/</td>';
				 }
		       	 html+='</tr>';
			}
			$('#ordSubs').html(html);
		}else {
			$('#ordSubs').html("没有开立医嘱！");
		}
	});
}
