$(function(){
	$("#leftToolbar").on('mouseover', function() {
		$CommonUI.poshytip($("#leftToolbar"),'请输入患者姓名/姓名拼音/手机号');
	});
	$("#leftToolbar").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#leftToolbar"));
	});
	//历史结算记录datagrid
	var options_Rek = {   height: 460, width: '100%', border: true, singleSelect: true, pagination: false, 
						rownumbers: false, fitColumns: true,
						onClickRow: function(rowIndex, rowData) {
							$('#patName').text(rowData.patientName);
							$('#patSex').text(rowData.patientSexid);
							$('#patBirthDate').text(rowData.birthDate == null ? "" : rowData.birthDate);
							$('#patidCard').text(rowData.patientTelephone);
							
							if(rowData.ordTypeid == '01') {
								//$('#refundBtn').linkbutton('disable');
								$('#refundBtn').attr('disabled','disabled');
								$CommonUI.autoCloseCenterMessage('中草药不可退！','error','',1000);
							}else{
								//$('#refundBtn').linkbutton('enable');
								$('#refundBtn').removeAttr('disabled');
							}
							$CommonUI.getDataGrid('#rekDetaildg').datagrid("loadData",{"total":"0","rows":[]});
							$.post($WEB_ROOT_PATH+ '/chargeManage/getPaidAccountfeeList.ajax',
									{'rekid':rowData.rekid},
									function(data){
										$CommonUI.getDataGrid('#rekDetaildg').datagrid('loadData',data);
									},'json');
							
						}
	};
	var sortOpts_Rek ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var queryParams_Rek = {feeSts:1,  page: 1, rows: 15 };
	var columns_Rek =[[
	               {title: "患者姓名",field: "patientName",width: 30},
	               {title: "结算单",field: "rekid",width: 120,hidden: true},
	               {title: "医嘱收费时间",field: "rekDate",width: 70},
	               {title: "收费人员",field: "rekUser",width: 30},
	               {title: "金额",field: "amountTotal",width: 30},	               
	               ]];
	//var url_Rek = $WEB_ROOT_PATH + '/patientManage/getPatientListByRefundFee.ajax';
	var url_Rek = '';
 	$CommonUI.datagrid('#reks', url_Rek, queryParams_Rek, columns_Rek, sortOpts_Rek, options_Rek);
	
	//结算详细datagrid
	var options = { toolbar: "#rightToolbar",height: 460,width: '100%',singleSelect: true,
					pagination: false,rownumbers: true,fitColumns: true,
					onClickRow: function(rowIndex, rowData) {}
	};
	var sortOpts = { remoteSort: false,sortName: '',sortOrder: 'asc' };
	var pageOpts = { pageNumber: 1, pageSize: 10 };
	var columns = [[
	                {field: "ck1",checkbox: true,hidden:true},
		            {title: "收费明细编号",field: "accountFeeid",hidden:true},
		            {title: "项目名称",field: "itemname",width: 150},
		            {title: "规格",field: "standard",width:70},
		            {title: "数量",field: "dispensQuantity",width: 40},
		            {title: "单位",field: "dispensUnit",width: 40},
		            {title: "单价",field: "salesprice",width: 40},
		            {title: "金额",field: "amountTotal",width: 40},
		            {title: "收费日期",field: "feeData",width: 100},
		            {title: "收费人员",field: "feeUsername",width: 60},
		    ]];
	var queryParams = { page: 1, rows: 10 };
	var url = '';
	$CommonUI.datagridgroup('#rekDetaildg', url, queryParams, 'ordid', function(value, rows){
		 return '<table id="ordN" style="border: 0;font-size: 14px;"><tr>' + 
		 		'<td style="width: 26px;border:0;" align="center"><input type="checkbox" checked="checked" disabled="disabled" name="'+value+'"'+
		 		'</td>' +
		 		'<td style="border:0">' + rows[0].ordName + ' - 共  ' + rows.length + ' 条记录' + '</td>' +
		 		'</tr></table>';
		}, columns, pageOpts, sortOpts,options);
	
	$('#queryConditionSelect').change(function(){
		if($('#queryConditionSelect').val() == 'patient.patient_name'){
			$('#nameValueDiv').css("display","inline");
			$('#queryValueText').css("display","none");
		}else{
			$('#nameValueDiv').css("display","none");
			$('#queryValueText').css("display","inline");
		}
	});
	
	//检索框放跟右边患者信息放一块，已收费病人列表只显示3天的 at 2016/04/12 需要修改后台方法
	$CommonUI.getDataGrid('#reks').datagrid({
		url:$WEB_ROOT_PATH + "/patientManage/getPatientListByRefundFee.ajax",
		queryParams:{ "filterStr": "","feeSts":1,"page": 1, "rows": 15}
	}); 
});

function queryBillList(){	 
	var queryValue = $('#patCbg').combogrid('getText');
	if(queryValue == ''){
		$CommonUI.alert('请输入患者姓名/姓名拼音/手机号查询！'); 
		return;
	}
	$CommonUI.getDataGrid('#reks').datagrid({
		url:$WEB_ROOT_PATH + "/patientManage/getPatientListByRefundFee.ajax",
		queryParams:{ "filterStr": queryValue,"feeSts":1,"page": 1, "rows": 15}
	}); 
	$('#patName,#patSex,#patBirthDate,#patidCard').text('');
	$('#rekDetaildg').datagrid("loadData",{"total":"0","rows":[]});
	
}

//不点击查询按钮触发
function queryBillList2(rowIndex, rowData){
	$.post($WEB_ROOT_PATH+ '/patientManage/getPatientListByRefundFee.ajax',{
		'patientid':rowData.patientid,"feeSts":1,"page": 1, "rows": 15},function(data){
			/*if(data['total'] == 0){
				$('#patName,#patSex,#patBirthDate,#patidCard').text('');
				$CommonUI.getDataGrid('#reks').datagrid('loadData',{"total":0,"rows":[]});
				//$CommonUI.alert('无可退费账单信息！');
			}else{
				$('#patName,#patSex,#patBirthDate,#patidCard').text('');
				$CommonUI.getDataGrid('#reks').datagrid('loadData',data);
			}*/
			$('#patName,#patSex,#patBirthDate,#patidCard').text('');
			$CommonUI.getDataGrid('#reks').datagrid('loadData',data);
			$CommonUI.getDataGrid('#rekDetaildg').datagrid('loadData',{"total":0,"rows":[]});
		},'json');
}

//如果有同名患者选择一个患者来查询退费单
function selectPat(patientid){
	$('#chooseRepeatPatDlg').dialog('close');
	$('#patName,#patSex,#patBirthDate,#patidCard').text('');
	$.post($WEB_ROOT_PATH+ '/clearingMgr/clearingMgrCtrl.htm?BLHMI=paidBillList',{'dto.queryCondition':'patient.patientid', 
		'dto.queryValue':patientid},function(data1){
			$CommonUI.getDataGrid('#reks').datagrid('loadData',data1);
	},'json');
}

//退费按钮
function refundFeeDlg(target) {
	if($('#reks').datagrid('getSelected')==null){
		$CommonUI.alert('请选择需要退费的账单!');
		return;
	}
	var ordid = "";
	var rows = $('#rekDetaildg').datagrid('getRows');
	var ordids = new Array(); 
	for(var i = 0;i<rows.length;i++){
		if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
			if(ordid != rows[i].ordid){
				ordids.push(rows[i].ordid);
			}
		}
		ordid = rows[i].ordid;
	}
	if(ordids == ''){
		$CommonUI.alert('退费账单有误!');
		return;
	}
	$.getJSON($WEB_ROOT_PATH+ "/chargeManage/calcOrderFee.ajax",{"ordids":ordids},
			function(json){
		        var fee = Number(json.reslut);
		
				$CommonUI.getDialog("#refundFeeDlg").dialog("move", {"top" : "50","left":"385"});
				$('#refundFeeDlg').dialog('open').dialog('setTitle', '门诊退费');
				$CommonUI.getForm('#refundFeeForm').form('clear');
				$('#refundReason').val('normal');
				$('#patNameLab').text($('#reks').datagrid('getSelected').patientName);
				$('#refundBillLab').text(rows[0].ordName);
				$('#refundFeeLab').text(fee.toFixed(2));
				$('#payModeLab').text(rows[0].paymodeTypename);
	});
}

//退费
function refundFee(){
	var selectedRow = $('#reks').datagrid('getSelected');
	var queryCondition = $('#queryConditionSelect').val();
	var queryValue = '';
	if(queryCondition == 'patient.patient_name' ){
		queryValue = $('#paCbg').combogrid('getText');
	}else{
		queryValue = $('#queryValueText').val();
	}
	$.post($WEB_ROOT_PATH + "/chargeManage/refundFee.ajax",
			/*{'dto.account.accountid':selectedRow.accountid, 'dto.account.admisSerialno':selectedRow.admisSerialno, 
			 'dto.accountrek.rekid':selectedRow.rekid, 
			 'dto.refundReason': $('#refundReason option:selected').text(), 
			 'dto.rekPaymode.paymodeTypeid': $('#rekDetaildg').datagrid('getRows')[0].paymodeTypeid,
			 'dto.ord.ordid':$('#rekDetaildg').datagrid('getRows')[0].ordid,
			 'dto.meSheet.patientid':selectedRow.patientid
			},*/
			{'accountid':selectedRow.accountid, 'admisSerialno':selectedRow.admisSerialno, 
			 'rekid':selectedRow.rekid, 
			 'refundReason': $('#refundReason option:selected').text(), 
			 'paymodeTypeid': $('#rekDetaildg').datagrid('getRows')[0].paymodeTypeid,
			 'ordid':$('#rekDetaildg').datagrid('getRows')[0].ordid,
			 'patientid':selectedRow.patientid
			},
			function(data){ 
				if(data.result == "success"){
					$('#refundFeeDlg').dialog('close');
					$CommonUI.alert("退费成功！","","提示");
					$CommonUI.getDataGrid('#rekDetaildg').datagrid("loadData",{"total":"0","rows":[]});
					$.post($WEB_ROOT_PATH+ '/patientManage/getPatientListByRefundFee.ajax',
							{"patientName": queryValue, "feeSts":1,"page": 1, "rows": 15},
							function(data){
								if(data['total'] == 0){
									$('#patName,#patSex,#patBirthDate,#patidCard').text('');
								}
								$CommonUI.getDataGrid('#reks').datagrid('loadData',data);
							},'json');
				}else{
					$CommonUI.alert("退费失败！","error");
				}							
			});
}
