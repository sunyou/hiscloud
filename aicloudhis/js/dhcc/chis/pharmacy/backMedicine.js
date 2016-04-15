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
		/*toolbar: "#tbLeft",*/
		singleSelect: true,
		pagination: false,
		fitColumns: true,
		//url : $WEB_ROOT_PATH + '/sendMedicine/sendMedicineCtrl.htm?BLHMI=queryBackMedListForPat',
		url: '',
		columns : [[
		      {title: "患者编号",field: "patientid",hidden:true},
		      {field: "ordid",hidden:true},
		      {title: "姓名",field: "patientName",width: 45},
		      {title: "医嘱名称",field: "ordName",width:50},
		      {title: "医嘱发药时间",field: "execDatetime",width: 100},
		      {title: "发药医师",field: "execUsername",width: 45}
		]],
		onClickRow: function(rowIndex, rowData) {
			$('#patName').text(rowData.patientName); 
			$('#patSex').text(rowData.patientSename);
			$('#patBirthDate').text(rowData.birthDate == null ? "" : rowData.birthDate);
			$('#patidCard').text(rowData.patientTelephone);
			
			if(rowData.ordTypeid == '01') {
				//$('#backMedBtn').linkbutton('disable');
				$('#backMedBtn').attr('disabled','disabled');
				$CommonUI.autoCloseCenterMessage('中草药不可退！','error','',1000);
			}else{
				$('#backMedBtn').removeAttr('disabled');
				//$('#backMedBtn').linkbutton('enable');
			}
			$CommonUI.getDataGrid('#OrderDg').datagrid("loadData",{"total":"0","rows":[]});
			var ordid = $('#patInfoDg').datagrid('getSelected').ordid;
			$.post($WEB_ROOT_PATH + '/sendMedicine/queryBackMedByOrdid.ajax',{'ordid':ordid},
					function(data){
						$CommonUI.getDataGrid('#OrderDg').datagrid('loadData',data);
					},'json');
		}
	});
	
	//发药明细Datagrid
	var options = { toolbar: "#infomsg", height: 460, width: 890,singleSelect: false, pagination: false, rownumbers: false,fitColumns: true,
					onLoadSuccess: function(data){
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
							width: 845, 
							singleSelect: true,
							pagination: false,
							fitColumns: true,
							rownumbers: true,
							//scrollbarSize: 0,
							url : $WEB_ROOT_PATH + '/pharmacyManage/querySendMedDetailList.ajax?ordid='+row.ordid ,
							columns : [[
						          {title: "药品名称",field: "itemname",width: 75},
						          {title: "药品通用名",field: "itemCommonName",width:75},
						          {title: "规格",field: "itemSpec",width:55},
						          {title: "数量",field: "dispensQuantity",width: 30},
						          {title: "单位",field: "dispensUnit",width: 30},
						          {title: "单价",field: "salesPrice",width: 30},
						          {title: "金额",field: "amountTotal",width: 30},
						          {title: "批次",field: "ordDate",width: 100,hidden:true},
						          {title: "生产厂家",field: "entname",width: 95},
						          {title: "备注",field: "note",width: 45}
							]],
							rowStyler : function(index,row,css){
								 return 'background-color:#BEEFFD;color:#000000';
							},
							onResize:function(){
					              $('#OrderDg').datagrid('fixDetailRowHeight',index);
					        },
					        onLoadSuccess:function(){
					              setTimeout(function(){
					                $('#OrderDg').datagrid('fixDetailRowHeight',index);
					              },0);
					       }
						});
						 $('#OrderDg').datagrid('fixDetailRowHeight',index);
					}
	};
	var sortOpts ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var pageOpts = { pageNumber: 1, pageSize: 10 };
	var queryParams = { page: 1, rows: 1 };
	var columns =[[
	               {field: "ck1",checkbox: true,hidden:false},
	               {field: "ordid",hidden: true},
	               {title: "医嘱名称",field: "ordName",width: 40},
	               {title: "医嘱类型",field: "ordTypeid",width: 40,
	            	   formatter: function(value,row,index){
	            		   if(value == '00'){ return '西医医嘱'; }
	            		   else if(value == '01'){ return '中草药医嘱'; }
	            		   else if(value == '02'){ return '材料医嘱'; }
	            	   }},
	               {title: "医嘱开立时间",field: "ordDate",width: 50},
	               {title: "开立科室",field: "orgname",width: 30},
	               {title: "开立医生",field: "empnameDoct",width: 30},
	               {title: "发药药房",field: "execOrgname",width:30},
	               {title: "发药时间",field: "execDatetime",width: 50},
	               {title: "发药医师",field: "execUsername",width: 30},
	               {title: "发药窗口",field: "uuidWindow",width: 30}
	               ]];
	//var url = $WEB_ROOT_PATH + '/doctAdviceManage/doctAdviceManageCtrl.htm?BLHMI=orderSubList';
	var url = '';
	//$CommonUI.edatagrid('#OrderDg', url, queryParams, columns, pageOpts, sortOpts, options);
	$CommonUI.datagriddetail('#OrderDg', url, {}, function(rowIndex, rowData){
		 return '<table id="MedInfoDg'+rowIndex+'" style="height:auto;"></table>';
	}, columns, pageOpts, sortOpts,options);
});

//患者列表查询按钮
function findPatient() {
	$('#patName,#patSex,#patBirthDate,#patidCard').text(''); 
	$CommonUI.getDataGrid('#OrderDg').datagrid("loadData",{"total":"0","rows":[]});
	var name = $('#patCbg').combogrid('getText');
	if(name == ''){
		$CommonUI.alert("请输入患者姓名/姓名拼音/手机号查询！");
		return;
		//alert("请输入患者姓名/姓名拼音/手机号查询！");
	}
	$CommonUI.getDataGrid('#patInfoDg').datagrid({
		url:$WEB_ROOT_PATH + '/sendMedicine/queryBackMedListForPat.ajax',
		queryParams:{
			"patientName": name
		}
	});
}

function findSelectedPatient(rowIndex, rowData) {
	$('#patName,#patSex,#patBirthDate,#patidCard').text(''); 
	$CommonUI.getDataGrid('#OrderDg').datagrid("loadData",{"total":"0","rows":[]});
	var patientid = rowData.patientid;
	$CommonUI.getDataGrid('#patInfoDg').datagrid({
		url:$WEB_ROOT_PATH + '/sendMedicine/queryBackMedListForPat.ajax',
		queryParams:{
			"patientid": patientid
		}
	});
}

//退药
function backMed(){
	var selections = $('#OrderDg').datagrid('getSelections').length;
	if(selections == 0){
		$CommonUI.alert("请选择医嘱进行退药！");
		return;
	}else{
		$CommonUI.confirm('确定退药？','question','',function(){
			var uuids = new Array();
			var ordids = new Array();
			for(var i=0; i<selections; i++){
				uuids.push($('#OrderDg').datagrid('getSelections')[i].uuid);
				ordids.push($('#OrderDg').datagrid('getSelections')[i].ordid);
			}
			postReq($WEB_ROOT_PATH + '/sendMedicine/backMedicine.ajax','',function(){
						$('#patInfoDg').datagrid('load');
						$('#OrderDg').datagrid('loadData',{"total":"0","rows":[]});
						$CommonUI.alert("退药完成！");
						$('#patName,#patSex,#patBirthDate,#patidCard').text(''); 
					}, function(){
						$CommonUI.alert("退药失败！");
					}, '',{"tmesheetuuids": uuids, "ordids": ordids});
		},'','','请确认',true);
		
	}
}
