$(function() {
	$("#tbLeft").on('mouseover', function() {
		$CommonUI.poshytip($("#tbLeft"),'请输入患者姓名/姓名拼音/手机号');
	});
	$("#tbLeft").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#tbLeft"));
	});
	//患者基本信息datagrid
	$CommonUI.getDataGrid('#patInfoDg').datagrid({
		height: 460, 
		width: '100%', 
		toolbar: "#tbLeft",
		singleSelect: true,
		pagination: false,
		fitColumns: true,
		url : $WEB_ROOT_PATH + '/pharmacyManage/getMedPatList.ajax',
		columns : [[
		      {title: "患者编号",field: "patientid",hidden:true},
		      {title: "姓名",field: "patientName",width: 45},
		      {title: "性别",field: "patientSename",width:25,align:'center'},
		      {title: "医嘱结算时间",field: "feeData",width: 100},
		      {title: "联系电话",field: "patientTelephone",width: 60}
		]],
		onClickRow: function(rowIndex, rowData) {
			$('#patName').text($('#patInfoDg').datagrid('getSelected').patientName); 
			$('#patSex').text($('#patInfoDg').datagrid('getSelected').patientSename);
			$('#patBirthDate').text($('#patInfoDg').datagrid('getSelected').birthDate == null ? "" : $('#patInfoDg').datagrid('getSelected').birthDate);
			$('#patidCard').text($('#patInfoDg').datagrid('getSelected').icard);
			
			$CommonUI.getDataGrid('#OrderDg').datagrid("loadData",{"total":"0","rows":[]});
			var patientid = $('#patInfoDg').datagrid('getSelected').patientid;
			$.post($WEB_ROOT_PATH + '/pharmacyManage/querySendMedSubList.ajax',{'patientid':patientid},
					function(data){
						$CommonUI.getDataGrid('#OrderDg').datagrid('loadData',data);
					},'json');
		}
	});
	
	//发药明细Datagrid
	var options = { toolbar: "#infomsg", height: 460, width: 900,singleSelect: false, pagination: false, rownumbers: false,fitColumns: true,
					onLoadSuccess : function(data){
						if(data.total == 0){
							$('#OrderDg').datagrid('unselectAll');
							return;
						}
						$('#OrderDg').datagrid('selectAll');
						var me = this;
					    setTimeout(function () {//延时触发easyui datagrid detailviewclick事件，不用计时器无法展开，不懂什么问题~
					    	$(me).parent().find('span.datagrid-row-expander').trigger('click'); //没效果注意修改这里的选择器
					    }, 10);
					},
					rowStyler : function(index,row,css){
						return 'background-color:#00BFFF;';
					},
					onExpandRow : function(index,row) {
						$CommonUI.getDataGrid('#MedInfoDg'+index+'').datagrid({
							width: 855, 
							singleSelect: true,
							pagination: false,
							fitColumns: true,
							autoRowHeight: true,
							rownumbers: true,
							//scrollbarSize: 0,
							url : $WEB_ROOT_PATH + '/pharmacyManage/querySendMedDetailList.ajax?ordid='+row.ordid ,
							columns : [[
						          {title: "药品名称",field: "itemname",width: 70},
						          {title: "药品通用名",field: "itemCommonName",width:70},
						          {title: "规格",field: "itemSpec",width:50},
						          {title: "数量",field: "dispensQuantity",width: 30},
						          {title: "单位",field: "dispensUnit",width: 30},
						          {title: "单价",field: "salesPrice",width: 30},
						          {title: "金额",field: "amountTotal",width: 30},
						          {title: "批次",field: "ordDate",width: 100,hidden:true},
						          {title: "生产厂家",field: "entname",width: 105},
						          {title: "备注",field: "note",width: 45}
							]],
							rowStyler : function(index,row,css){
								return 'background-color:#BEEFFD;color:#000000';
							},
							onResize:function(){
								$('#OrderDg').datagrid('fixDetailRowHeight',index);
					        },
					        onLoadSuccess:function(){
					        	setTimeout(function(){$('#OrderDg').datagrid('fixDetailRowHeight',index);},0);
					        }
						});
						$('#OrderDg').datagrid('fixDetailRowHeight',index);
					}
	};
	var sortOpts = { remoteSort: false, sortName: '', sortOrder: 'asc' };
	var pageOpts = { pageNumber: 1, pageSize: 10 };
	//var queryParams = { page: 1, 	rows: 1 };
	var columns = [[
	               {field: "ck1",checkbox: true,hidden:false},
	               {field: "ordid",hidden: true},
	               {title: "医嘱名称",field: "ordName",width: 50},
	               {title: "医嘱类型",field: "ordTypeid",width: 40,
	            	   formatter: function(value,row,index){
	            		   if(value == '00'){ return '西医医嘱'; }
	            		   else if(value == '01'){ return '中草药医嘱'; }
	            		   else if(value == '02'){ return '材料医嘱'; }
	            	   }},
	               {title: "医嘱开立时间",field: "ordDate",width: 60},
	               {title: "开立科室",field: "orgname",width: 40},
	               {title: "开立医生",field: "empname",width: 40},
	               {title: "医嘱金额",field: "amountTotal",width:30},
	               {title: "收费时间",field: "feeData",width: 60},
	               {title: "收费人员",field: "feeUsername",width: 40},
	               {field: "windowid",hidden: true},
	               {title: "发药窗口",field: "windonsname",width: 40}
	               ]];
	//var url = $WEB_ROOT_PATH + '/doctAdviceManage/doctAdviceManageCtrl.htm?BLHMI=orderSubList';
	var url = '';
	//$CommonUI.edatagrid('#OrderDg', url, queryParams, columns, pageOpts, sortOpts, options);
	$CommonUI.datagriddetail($('#OrderDg'), url, {}, function(rowIndex, rowData){
		 return '<table id="MedInfoDg'+rowIndex+'" style="height:auto;border: 0px;"></table>';
	}, columns, pageOpts, sortOpts,options);
	
	
});

//患者列表查询按钮
function findPatient() {
	$('#patName,#patSex,#patBirthDate,#patidCard').text(''); 
	$CommonUI.getDataGrid('#OrderDg').datagrid("loadData",{"total":"0","rows":[]});
	var name = $('#patCbg').combogrid('getText');
	$CommonUI.getDataGrid('#patInfoDg').datagrid({
		url:$WEB_ROOT_PATH + '/pharmacyManage/getMedPatList.ajax',
		queryParams:{ "patientName": name }
	});
}

function sendMed(){
	var selections = $('#OrderDg').datagrid('getSelections').length;
	if(selections == 0){
		$CommonUI.alert("请选择医嘱进行发药！");
		return;
	}else{
		var uuids = new Array();
		var ordids = new Array();
		var selectIndex = 0;
		var itemids = new Array();
		var execOrgids = new Array();
		var flag = null;
		var sendMedFlag = null;//是否可进行发药操作
		for(var i=0; i<selections; i++){
			uuids.push($('#OrderDg').datagrid('getSelections')[i].uuid);
			ordids.push($('#OrderDg').datagrid('getSelections')[i].ordid);
			selectIndex=$('#OrderDg').datagrid('getRowIndex',$('#OrderDg').datagrid('getSelections')[i]);
			for(var j=0; j<$('#MedInfoDg'+selectIndex).datagrid('getRows').length; j++){
				if(itemids.length == 0){
					itemids.push($('#MedInfoDg'+selectIndex).datagrid('getRows')[j].itemid);
					execOrgids.push($('#MedInfoDg'+selectIndex).datagrid('getRows')[j].orgidExec);
				}else{
					for(var a=0; a<itemids.length; a++){
						//alert('a='+a+','+$('#MedInfoDg'+selectIndex).datagrid('getRows')[j].itemid+'--'+itemids[a]);
						if($('#MedInfoDg'+selectIndex).datagrid('getRows')[j].itemid == itemids[a]){
							flag = true;//已存在
							break;
						}else{
							flag = false;
						}
					}
					if(!flag){
						itemids.push($('#MedInfoDg'+selectIndex).datagrid('getRows')[j].itemid);
						execOrgids.push($('#MedInfoDg'+selectIndex).datagrid('getRows')[j].orgidExec);
					}
				}
			}
		}
		//console.log(itemids);
		//查询药品剩余库存
		$.getJSON($WEB_ROOT_PATH + '/sendMedicine/querySurplusStockForCurrentOrg.ajax',{"itemids": itemids,"execOrgids":execOrgids},
				function(json){
					//console.log(json);
					var temp_quantity = new Number(0);
					for(var a=0; a<itemids.length; a++){
						for(var i=0; i<selections; i++){
							selectIndex=$('#OrderDg').datagrid('getRowIndex',$('#OrderDg').datagrid('getSelections')[i]);
							for(var j=0; j<$('#MedInfoDg'+selectIndex).datagrid('getRows').length; j++){
								if(itemids[a] == $('#MedInfoDg'+selectIndex).datagrid('getRows')[j].itemid){
									temp_quantity += $('#MedInfoDg'+selectIndex).datagrid('getRows')[j].dispensQuantity;
								}
							}
						}
						for(var b=0; b<json["total"]; b++){
							if(itemids[a] == json['rows'][b].itemid){
//								console.log(itemids[a] +'发药数'+temp_quantity);
//								console.log(json['rows'][b].itemid+json['rows'][b].itemname+'库存剩余：'+json['rows'][b].surplusQuantity);
//								console.log(json['rows'][b].surplusQuantity - temp_quantity);
//								
								if(json['rows'][b].surplusQuantity - temp_quantity >= 0){
									sendMedFlag = true;
									//console.log("可发药");
								}else{
									$CommonUI.alert(json['rows'][b].itemname+'库存不足，'+'库存剩余'+json['rows'][b].surplusQuantity+'，不能发药！','error');
									//console.log("不可发药");
									return;
								}
							}
						}
						temp_quantity=0;
					}
					if(sendMedFlag == true){
						$CommonUI.confirm('发药信息核对完成并进行发药？','question','',function(){
							postReq($WEB_ROOT_PATH + '/pharmacyManage/sendMedicine.ajax','',function(returnStr){
								/*if(returnStr['dto.returnString'] != ''){
								for(var i=0; i<json["total"]; i++){
									if(returnStr['dto.returnString'] == json['rows'][i].itemid){
										$CommonUI.alert(json['rows'][i].itemname+"库存不足，请增加库存！发药失败！",'error');
									}
								}
								
							}*/
								if(returnStr['returnString'] != '' && returnStr['returnString'] != null){
									$CommonUI.alert(returnStr['dto.returnString']+"库存不足，请增加库存！发药失败！",'error');
								}else{
									$('#patInfoDg').datagrid('load');
									$('#OrderDg').datagrid('loadData',{"total":"0","rows":[]});
									$CommonUI.alert("发药完成！");
									$('#patName,#patSex,#patBirthDate,#patidCard').text('');
								}
							}, function(){
								$CommonUI.alert("发药失败！");
							}, '',{"tmesheetuuids": uuids, "ordids": ordids});
						},'','','请确认',true);
					}
				});
	}
}
