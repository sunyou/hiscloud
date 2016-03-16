$(function() {
	$("#tbLeft").on('mouseover', function() {
		$CommonUI.poshytip($("#tbLeft"),'请输入患者姓名/姓名拼音/手机号');
	});
	$("#tbLeft").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#tbLeft"));
	});
	//患者基本信息datagrid
	var options_pat = { toolbar: "#tbLeft", height: 460, width: 300, border: true, singleSelect: true, pagination: false, rownumbers: false,
						fitColumns: true,
						//单击左侧行记录事件
						onClickRow: function(rowIndex, rowData) {
							$('#patName').text($('#patInfoDg').datagrid('getSelected').patientName);
							$('#patSex').text($('#patInfoDg').datagrid('getSelected').patientSexid);
							$('#patBirthDate').text($('#patInfoDg').datagrid('getSelected').birthDate == null ? "" : $('#patInfoDg').datagrid('getSelected').birthDate);
							
							$CommonUI.getDataGrid('#dtlFeeDg').datagrid("loadData",{"total":"0","rows":[]});
							//医嘱流水
							var serialno = $('#patInfoDg').datagrid('getSelected').serialno;
							$.post($WEB_ROOT_PATH + '/chargeManage/getFeeItem.ajax',{'serialno':serialno},
									function(data){
										$CommonUI.getDataGrid('#dtlFeeDg').datagrid('loadData',data);
									},'json');
							//设置就诊流水号
							/*var admisSerialno = $('#patInfoDg').datagrid('getSelected').admisSerialno;
							$('#admisSerialno').val(admisSerialno);*/
						}
	};
	var sortOpts_pat ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var queryParams_pat = {page: 1, rows: 15 };
	var columns_pat =[[
	               {title: "患者编号",field: "patientid",hidden:true},
	               {title: "姓名",field: "patientName",width: 45},
	               {title: "性别",field: "patientSexid",width:25,align:'center'},
	               {title: "医嘱开立时间",field: "ordDate",width: 100},
	               {title: "联系电话",field: "patientTelephone",width: 60}
	               ]];
	var url_pat = $WEB_ROOT_PATH + '/patientManage/getNoChargePatientList.ajax';
	$CommonUI.datagrid('#patInfoDg', url_pat, queryParams_pat, columns_pat, sortOpts_pat, options_pat);
	
	//消费明细Datagrid
	var options = { toolbar: "#infomsg", height: 436, width: 900, border: true, singleSelect: true, pagination: false, rownumbers: true,
					fitColumns: true,checkOnSelect: true, method: 'post',
					onLoadSuccess: function(){
						amountTotalText();
					},
					onClickRow: function(rowIndex, rowData){ }
	};
	var sortOpts ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var pageOpts = { pageNumber: 1, pageSize: 10 };
	var queryParams = {feeSts:1, page: 1, 	rows: 1 };
	var columns =[[
	               {field: "ck1",checkbox: true,hidden:true},
//	               {title: "收费明细编号",field: "accountFeeid",hidden:true}, //这个就不需要了，没用
	               {title: "项目名称",field: "itemname",width: 140}, 
	               {title: "规格",field: "itemspec",width:60},
	               {title: "数量",field: "unitQuantity",width: 30},
	               {title: "单位",field: "unitName",width: 30},
	               {title: "单价",field: "salesPrice",width: 30},
	               {title: "金额",field: "amountTotal",width: 30,
	            	   formatter:function(value,row,index){
	            		   var total = row.salesPrice * row.unitQuantity;
	            		   return total.toFixed(2);
	            	   }},
	               {title: "医嘱开立时间",field: "ordDate",width: 80},
	               {title: "医嘱开立医生",field: "empnameDoct",width: 60},
	               {title: "执行科室",field: "orgnameExec",width: 50}
	               ]];
	
	var url = $WEB_ROOT_PATH + '/chargeManage/getFeeItem.ajax';
	//$CommonUI.datagrid('#dtlFeeDg', url, queryParams, columns, pageOpts, sortOpts, options);
	//根据ordid分组显示
	$CommonUI.datagridgroup('#dtlFeeDg', url, queryParams, 'ordid', function(value, rows){
		 return '<table id="ordN" style="border: 0;font-size: 14px;"><tr>' + 
		 		'<td style="width: 26px;border:0;" align="center"><input type="checkbox" checked="checked" name="'+value+'"'+
		 		'onclick="amountTotalText()"> '+
		 		'</td>' +
		 		'<td style="border:0">' + rows[0].ordName + ' - 共  ' + rows.length + ' 条记录' + '</td>' +
		 		'</tr></table>';
		}, columns, pageOpts, sortOpts,options);
	 
   //增加项目框中的数量输入框变化的时候金额相应变化
   /*$("#addItemquantity").change(function() {
    	 $('#addItemMoney').val($('#addItemUprice').attr("value") * $('#addItemquantity').attr("value"));
    });
    cancelItemClick();*/
	
	//numberbox屏蔽负号
	/*$('#payMoney').unbind('keydown');//移除事件
	$('#payMoney').bind('keydown',function(event){
		if(event.keyCode == 173 || event.keyCode == 109){//负号键
			return false;
		}
	});*/
	$('.dhc-numberbox').unbind('keydown');//移除事件
	$('.dhc-numberbox').bind('keydown',function(event){
		if(event.keyCode == 173 || event.keyCode == 109){//负号键
			return false;
		}
	});
});

//明细datagrid右下角的费用总额显示
function amountTotalText(){
	var fee = 0;//总费用
	var feeWM = 0;//西药费
	var feeCM = 0;//中药费
	var feeJY = 0;//检验费
	var feeJC = 0;//检查费
	var feeQT = 0;//其他费用
	var rows = $('#dtlFeeDg').datagrid('getRows');
	for(var i = 0;i<rows.length;i++){
		var ordid = rows[i].ordid;
		if($('input[name="'+ordid+'"]').prop("checked")==true){
			if(rows[i].ordTypeid == '00'){
				feeWM += rows[i].salesPrice * rows[i].unitQuantity;
			}else if(rows[i].ordTypeid == '01'){
				feeCM += rows[i].salesPrice * rows[i].unitQuantity;
			}else if(rows[i].ordTypeid == '03'){
				feeJY += rows[i].salesPrice * rows[i].unitQuantity;
			}else if(rows[i].ordTypeid == '04'){
				feeJC += rows[i].salesPrice * rows[i].unitQuantity;
			}else{
				feeQT += rows[i].salesPrice * rows[i].unitQuantity;
			}
			fee += rows[i].salesPrice * rows[i].unitQuantity;
		}
	}
	$('#amountTotalWM').text((feeWM).toFixed(2));
	$('#amountTotalCM').text((feeCM).toFixed(2));
	$('#amountTotalJY').text((feeJY).toFixed(2));
	$('#amountTotalJC').text((feeJC).toFixed(2));
	$('#amountTotalElse').text((feeQT).toFixed(2));
	$('#amountTotalT').text((fee).toFixed(2));
}

//选择项目名称
/*function addItemCbgClick(rowIndex,rowData) {
	//设置项目名称框的值
	$CommonUI.getComboGrid('#addItemCbg').combogrid('setValue', $('#addItemCbg').combogrid('getText'));
	$('#addItemGg').val($('#addItemCbg').combogrid('grid').datagrid('getSelected').itemspec);//规格
	$('#addItemUnit').val($('#addItemCbg').combogrid('grid').datagrid('getSelected').basiCunit);//单位
	$('#addItemUprice').val($('#addItemCbg').combogrid('grid').datagrid('getSelected').salesPrice);//售价 单价
	$('#addItemquantity').val(1);
	var salesPrice = $('#addItemCbg').combogrid('grid').datagrid('getSelected').salesPrice;
	$('#addItemMoney').val(salesPrice*$('#addItemquantity').attr("value"));
}*/

//增加项目按钮
/*function addItemClick(){ 
	if($('#addItemCbg').combogrid('getText')==""){
		$CommonUI.alert("项目名称不能为空！");
		return;
		if(!$('#addItemquantity').val()){
			$CommonUI.alert("数量不能为空！");
			return;
			if(!$('#addItemGg').val()){
				$CommonUI.alert("请选择正确的项目名称！");
				return;
			}
		}
	}
	saveItem();
	cancelItemClick();
} */

//保存新增项目
/*function saveItem(){
	postReq($WEB_ROOT_PATH + '/paadmfee/paadmfeeCtrl.htm?BLHMI=save', '#addItemForm',
			succAdd, err, {skipHidden : false});
	$('#dtlFeeDg').datagrid('reload');
}
*/
//删除增加项按钮
/*function delItemClick(){
	if ($CommonUI.getDataGrid("#dtlFeeDg").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}
	if($('#dtlFeeDg').datagrid('getSelected').feeUsername=="材料医嘱"){
		$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
			var row = $CommonUI.getDataGrid("#dtlFeeDg").datagrid('getSelected');
			$.post($WEB_ROOT_PATH+"/paadmfee/paadmfeeCtrl.htm?BLHMI=deleteById",{'dto.accountfee.accountFeeid': row.accountFeeid}, function(){
				$CommonUI.getDataGrid("#dtlFeeDg").datagrid('reload');
				cancelItemClick();
			});
		});
	}else{
		$CommonUI.alert('对不起，医生医嘱不能被删除！');
		return;
	}
}*/

//修改增加项按钮
/*function updateItemClick(){
	if($('#dtlFeeDg').datagrid('getSelected').feeUsername=="材料医嘱"){
		postReq($WEB_ROOT_PATH + '/paadmfee/paadmfeeCtrl.htm?BLHMI=update','#addItemForm',
				succAdd, err, {skipHidden : false});
		$('#dtlFeeDg').datagrid('reload');
		cancelItemClick();
	}else{
		$CommonUI.alert('对不起，医生医嘱不能被修改！');
		return;
	}
}*/

//保存医嘱按钮
function saveYZClick(){
	
}

//取消新增材料按钮 重置表单
/*function cancelItemClick() {
	document.getElementById("addItemForm").reset();
}*/

//父页面中的结算按钮
function getTotalPrice(target) {
	if($('#patInfoDg').datagrid('getSelected')==null){
		$CommonUI.alert("请选择一个患者进行结算！");
		return;
	}
	if($('#amountTotalT').text()==0){
		$CommonUI.alert("未选择结算医嘱或结算医嘱信息不正确！",'error');
		return;
	}
	var itemids = new Array();
	var execOrgids = new Array();
	var flag = null;
	var rows = $('#dtlFeeDg').datagrid('getRows');
	var sendMedFlag = false;
	for(var i = 0;i<rows.length;i++){
		if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
			if(rows[i].ordTypeid == '00' || rows[i].ordTypeid == '01' || rows[i].ordTypeid == '02'){
				if(itemids.length == 0){
					itemids.push(rows[i].itemid);
					execOrgids.push(rows[i].orgidExec);
				}else{
					for(var j=0; j<itemids.length; j++){
						if(rows[i].itemid == itemids[j]){
							flag = true;//已存在
							break;
						}else{
							flag = false;
						}
					}
					if(!flag){
						itemids.push(rows[i].itemid);
						execOrgids.push(rows[i].orgidExec);
					}
				}
			}
		}
	}
	//查询药品剩余库存
	if(itemids != ''){
		$.getJSON($WEB_ROOT_PATH + '/sendMedicine/querySurplusStockForCurrentOrg.ajax',{"itemids": itemids,"execOrgids":execOrgids},
				function(json){
					//console.log(json);
					var temp_quantity = new Number(0);
					for(var a=0; a<itemids.length; a++){
						for(var i = 0;i<rows.length;i++){
							if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
								if(itemids[a] == rows[i].itemid){
									temp_quantity += rows[i].unitQuantity;
								}
							}
						}
						for(var b=0; b<json["total"]; b++){
							if(itemids[a] == json['rows'][b].itemid){
								if(json['rows'][b].surplusQuantity - temp_quantity >= 0){
									sendMedFlag = true;
								}else{
									$CommonUI.alert(json['rows'][b].itemname+'库存不足，'+'库存剩余'+json['rows'][b].surplusQuantity+'。<br>请增加库存后再进行收费发药操作！','error');
									return;
								}
							}
						}
						temp_quantity=0;
					}
				//	console.log(sendMedFlag);
					if(sendMedFlag == true){
						calcOrderFee(rows);
					}else{
						$CommonUI.alert('当前药品无库存。<br>请增加库存后再进行收费发药操作！','error');
					}
			});
	}else{
		calcOrderFee(rows);
	}
}

function calcOrderFee(rows){
	var ordid = "";
	var ordids = new Array(); 
	for(var i = 0;i<rows.length;i++){
		if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
			if(ordid != rows[i].ordid){
				ordids.push(rows[i].ordid);
			}
		}
		ordid = rows[i].ordid;
	}
	$.getJSON($WEB_ROOT_PATH+ "/chargeManage/calcOrderFee.ajax",{"ordids":ordids},
			function(json){
		        var fee = Number(json.reslut);
				if(fee.toFixed(2) == 0){
					$CommonUI.alert("结算信息有误！",'error');
					return;
				}else{

					$CommonUI.getDialog("#jsDlg").dialog("move", {"top" : "50"});
					$('#jsDlg').dialog('open').dialog('setTitle','结算');
					

					$CommonUI.getForm("#jsForm").form('clear');
					
					//不知道设置这默认值干吗用的？
					//CommonUI.getComboBox('#payForWay').combobox('setValue', '01');
					

					$('#totalMoney').val(fee.toFixed(2));//总额
					$('#shouldPay').val(fee.toFixed(2));//应付
				}
	});
}

//应找金额
function backFee(){
	if(($('#payMoney').val()-$('#shouldPay').val()).toFixed(2) == 'NaN'){
		  $('#payMoney').val($('#payMoney').val().substr(0, $('#payMoney').val().length - 1));
	}
	$('#backMoney').val(($('#payMoney').val()-$('#shouldPay').val()).toFixed(2));//应找 小数点后两位
}
//结算
function jsBtn(){
	if($('#payMoney').val()==""){
		$CommonUI.alert("请输入付款金额！");
		return;
	}
	if($('#backMoney').val()<0 ){
		$CommonUI.alert("请输入正确的付款金额！");
		return;
	}
	if($('#payForWay').combobox('getText')==""){
		$CommonUI.alert("请选择付款方式！");
		return;
	}
	//结算操作数据准备
	//遍历需要结算的明细
 	var rows = $('#dtlFeeDg').datagrid('getRows');
 	var Accountfees = new Array();
 	var accountfeesStr = "";
	var ordid = "";
 	var Ords = new Array(); 
 	var ordsStr = "";
 	var Accounts = new Array();
 	var accountsStr = "";
 	var Accountreks = new Array();
 	var accountreksStr = "";
 	var RekPaymodes = new Array();
 	var rekPaymodesStr = "";
 	//配药单记录表
 	var MeSheetRecords = new Array();
 	var meSheetRecordsStr = "";
 	
	for(var i = 0;i<rows.length;i++){
		if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
			var Accountfee = new Object();
			Accountfee.itemid = rows[i].itemid;
			Accountfee.itemname = rows[i].itemname;//项目名称
			Accountfee.standard = rows[i].itemspec;//规格
			Accountfee.dispensUnit = rows[i].unitName;//单位
			Accountfee.salesprice = rows[i].salesPrice;//单价
			Accountfee.dispensQuantity = rows[i].unitQuantity;//数量
			Accountfee.purchaseprice = rows[i].purchasePrice;//项目购入价
			Accountfee.basicUnit = rows[i].basicUnit;//基本单位
			Accountfee.basicQuantity = rows[i].quantity;//基本单位数量
			Accountfee.facotr = rows[i].factor;//基本单位和包装单位换算序数
			Accountfee.orgidExec = rows[i].orgidExec;//执行科室id
			Accountfee.orgnameExec = rows[i].orgnameExec;//执行科室名称
			Accountfee.orgid = rows[i].orgid;//开立科室id
			Accountfee.orgname = rows[i].orgname;//开立科室名称
			Accountfee.ordid = rows[i].ordid;//医嘱单编码
			Accountfee.rownoOrdersub = rows[i].rowno;//医嘱单序号
			Accountfee.uuid = rows[i].uuid;//医嘱明细编码
			Accountfee.amountTotal = rows[i].amountTotal;//患者总金额
			Accountfees.push(Accountfee);
			//配药单记录表数据
			if(rows[i].ordTypeid == "00" || rows[i].ordTypeid == "01"){
				var MeSheetRecord = new Object();
				MeSheetRecord.ordid = rows[i].ordid;//医嘱单编码
				MeSheetRecord.uuidordsub = rows[i].uuid;//医嘱明细编码
				MeSheetRecord.itemid = rows[i].itemid;
				MeSheetRecord.itemname = rows[i].itemname;//项目名称
				MeSheetRecord.itemSpec = rows[i].itemspec;//规格
				MeSheetRecord.dispensUnit = rows[i].unitName;//单位
				MeSheetRecord.dispensQuantity = rows[i].unitQuantity;//数量
				MeSheetRecord.salesprice = rows[i].salesPrice;//单价
				MeSheetRecord.factor = rows[i].factor;//基本单位和包装单位换算序数
				MeSheetRecord.wholesalesPrice = rows[i].wholesalesPrice;//批发价(进价)
				MeSheetRecords.push(MeSheetRecord);
			}
			
			var admisSerialno = rows[i].admisSerialno;
			//遍历需要更新的医嘱单
			if(ordid != rows[i].ordid){
				//需要更新的医嘱id
				var Ord = new Object();
				Ord.ordid = rows[i].ordid;
				Ord.ordTypeid = rows[i].ordTypeid;				
				Ords.push(Ord);
				
				//账单表数据
				var Account = new Object();
				Account.patientid = $('#patInfoDg').datagrid('getSelected').patientid;//患者id
				Account.serialno = $('#patInfoDg').datagrid('getSelected').serialno;//挂号流水号
				Account.admisSerialno = admisSerialno; 
				Accounts.push(Account); 
				
				//插入结算表数据
				var Accountrek = new Object();
				Accountrek.serialno = $('#patInfoDg').datagrid('getSelected').serialno;//挂号流水号
				Accountrek.admisSerialno = admisSerialno;//就诊流水号
				Accountrek.patientid = $('#patInfoDg').datagrid('getSelected').patientid;//患者id				 
				Accountreks.push(Accountrek);
				
				var RekPaymode = new Object();
				RekPaymode.paymodeTypeid = $('#payForWay').combobox('getValue');//结算方式id 
				RekPaymodes.push(RekPaymode);
			}
		}
		ordid = rows[i].ordid;
	}
	accountfeesStr = $.toJSON(Accountfees);
	accountsStr = $.toJSON(Accounts);
	accountreksStr = $.toJSON(Accountreks);
	rekPaymodesStr = $.toJSON(RekPaymodes);
	ordsStr =  $.toJSON(Ords);
	meSheetRecordsStr = $.toJSON(MeSheetRecords);
	
	postReq($WEB_ROOT_PATH + '/chargeManage/chargeFee.ajax','',
		function(data){
			//console.log(data['dto.meSheets']);
			if(data['reslut'] == "success"){
				clearData();
				$CommonUI.alert("收费成功！");
			}else{
				$CommonUI.alert("收费失败！");
			}
		   /*if(data['meSheets'] == null || data['meSheets'] == 'null' || data['meSheets'] == ''){
				clearData();
				$CommonUI.alert("收费成功！");
			}
			else{
				$CommonUI.confirm('收费成功！是否直接发药？','question','',function(){
				
				//	console.log(data['dto.meSheets'].length);
					var uuids = new Array();
					var ordids = new Array();
					for(var i=0; i<data['meSheets'].length; i++){
						uuids.push(data['meSheets'][i].uuid);
						ordids.push(data['meSheets'][i].ordid);
					}
						var itemids = new Array();
					var flag = null;
					var rows = $('#dtlFeeDg').datagrid('getRows');
					for(var i = 0;i<rows.length;i++){
						if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
							if(rows[i].ordTypeid == '00' || rows[i].ordTypeid == '01' || rows[i].ordTypeid == '02'){
								if(itemids.length == 0){
									itemids.push(rows[i].itemid);
								}else{
									for(var j=0; j<itemids.length; j++){
										if(rows[i].itemid == itemids[j]){
											flag = true;//已存在
											break;
										}else{
											flag = false;
										}
									}
									if(!flag){
										itemids.push(rows[i].itemid);
									}
								}
							}
						}
					}
					sendMedicine(itemids,uuids,ordids);
				
					postReq($WEB_ROOT_PATH + '/sendMedicine/sendMedicine.ajax','',function(returnStr){
						if(returnStr['returnString'] != '' && returnStr['returnString'] != null){
							for(var i=0; i<json["total"]; i++){
								if(returnStr['dto.returnString'] == json['rows'][i].itemid){
									$CommonUI.alert(json['rows'][i].itemname+"库存不足，请增加库存！发药失败！",'error');
								}
							}
							$CommonUI.alert(returnStr['returnString']+"库存不足，请增加库存后手动发药！发药失败！",'error');
							clearData();
						}else{
							clearData();
							$CommonUI.alert("发药完成！");
						}
					}, function(){
						$CommonUI.alert("发药失败！");
						clearData();
					}, '',{"uuids": uuids, "ordids": ordids});
					
				},'',function(){
					clearData();
				},'请确认',true);
			}*/
		}, 
		function(){
			$CommonUI.alert("收费失败！");
		}, '',
		{"accountfeesString":accountfeesStr, "ordsString":ordsStr, "accountreksString": accountreksStr,
		 "accountsString": accountsStr, "rekPaymodesString": rekPaymodesStr, "meSheetRecordsString": meSheetRecordsStr});
	$('#jsDlg').dialog('close');
}

//患者列表查询按钮
function findPatient() {
	var name = $('#patCbg').combogrid('getText');
	$CommonUI.getDataGrid('#patInfoDg').datagrid({
		url:$WEB_ROOT_PATH + "/patientManage/getNoChargePatientList.ajax",
		queryParams:{ "patientName": name,"page": 1, "rows": 15}
	});
	//$('#patCbg').combogrid('setText','');
	$('#patName,#patSex,#patBirthDate').text('');
	$('#dtlFeeDg').datagrid("loadData",{"total":"0","rows":[]});
}
	
//结算成功后清除页面数据
function clearData(){
	$('#patName,#patSex,#patBirthDate').text('');
	$('#patInfoDg').datagrid('reload');
	$('#dtlFeeDg').datagrid("loadData",{"total":"0","rows":[]});
}

/*function sendMedicine(itemids,uuids,ordids){
	//console.log(itemids+'--'+uuids+'--'+ordids);
	var rows = $('#dtlFeeDg').datagrid('getRows');
	var sendMedFlag = false;
	//查询药品剩余库存
	$.getJSON($WEB_ROOT_PATH + '/sendMedicine/sendMedicineCtrl.htm?BLHMI=querySurplusStockForCurrentOrg',{"dto.itemids": itemids},
			function(json){
				//console.log(json);
				var temp_quantity = new Number(0);
				for(var a=0; a<itemids.length; a++){
					for(var i = 0;i<rows.length;i++){
						if($('input[name="'+rows[i].ordid+'"]').prop("checked")==true){
							if(itemids[a] == rows[i].itemid){
								temp_quantity += rows[i].unitQuantity;
							}
						}
					}
					for(var b=0; b<json["total"]; b++){
						if(itemids[a] == json['rows'][b].itemid){
//							console.log(itemids[a] +'发药数'+temp_quantity);
//							console.log(json['rows'][b].itemid+json['rows'][b].itemname+'库存剩余：'+json['rows'][b].surplusQuantity);
//							console.log(json['rows'][b].surplusQuantity - temp_quantity);
							if(json['rows'][b].surplusQuantity - temp_quantity >= 0){
								sendMedFlag = true;
								//console.log("可发药");
							}else{
								$CommonUI.alert(json['rows'][b].itemname+'库存不足，'+'库存剩余'+json['rows'][b].surplusQuantity+'，发药失败！请增加库存后进行发药操作！','error');
								clearData();
								//console.log("不可发药");
								return;
							}
						}
					}
					temp_quantity=0;
				}
				console.log(sendMedFlag);
				if(sendMedFlag == true){
					postReq($WEB_ROOT_PATH + '/sendMedicine/sendMedicineCtrl.htm?BLHMI=sendMedicine','',function(returnStr){
						if(returnStr['dto.returnString'] != ''){
							for(var i=0; i<json["total"]; i++){
								if(returnStr['dto.returnString'] == json['rows'][i].itemid){
									$CommonUI.alert(json['rows'][i].itemname+"库存不足，请增加库存！发药失败！",'error');
								}
							}
						}else{
							clearData();
							$CommonUI.alert("发药完成！");
						}

					}, function(){
						$CommonUI.alert("发药失败！");
						clearData();
					}, '',{"dto.uuids": uuids, "dto.ordids": ordids});
				}
		});
}*/

function succAdd(){
	$CommonUI.alert("成功！");
}
function err(){
	$CommonUI.alert("失败！");
}
