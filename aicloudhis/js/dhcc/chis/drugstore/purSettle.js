var f='0';  //判断是追加支付  还是第一次支付
var userId;
$(function(){
	$CommonUI.getComboBox('#org').combobox({  
		 url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
		    valueField:'orgid',  
		    textField:'orgname'   
	}); 
	$CommonUI.getComboBox('#org_s').combobox({  
		 url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
		    valueField:'orgid',  
		    textField:'orgname'    
	}); 
	
	$CommonUI.getDataGrid('#inoutDetail').datagrid({
		height:340,
		fitColumns:false,
		singleSelect:true,
		rownumbers: true,
		pagination: false,
	    columns:[[  
		  	        {field:'itemid',title:'项目编码',width:10,align:'center',hidden:true },
		  	        {field:'itemid',title:'项目编码',width:10,align:'center',hidden:true },
		  	        {field:'itemname',title:'药品名称',width:140,align:'center',
		  	        	formatter:function(value,row,index){
	     					return "<div align='left'>"+value+"</div>";
	     				}},
			        {field:'unitquantity',title:'数量',width:45,align:'center'},
			        {field:'unitname',title:'单位',width:45,align:'center'},
			        {field:'unitSalePrice',title:'售价',width:60,align:'center'}, 
			        {field:'unitPurPrice',title:'进价',width:70,align:'center'},
			        {field:'wholesalesAmount',title:'购入总价',width:70,align:'center'},
			        {field:'batchcode',title:'批次号',width:80,align:'center'},
			        {field:'creatDate',title:'生产日期',width:70,align:'center'},
			        {field:'expiryDate',title:'失效日期',width:70,align:'center'},
			        {field:'producerName',title:'产地/厂家',width:150,align:'center',
		  	        	formatter:function(value,row,index){
	     					return "<div align='left'>"+value+"</div>";
	     				}},
			        {field:'invoiceno',title:'发票号',width:100,align:'center',editor: {type: 'text'}}, 
			        {field:'payAmount',title:'付款金额',width:60,align:'center',editor: {type: 'numberbox',options:{precision:2}}},
	     			{field:'paiedAmount',title:'已支付',width:60,align:'center',
			        	formatter:function(value,row,index){
	     					if(value==undefined){
	     						return 0;
	     					}else{
	     						return value;
	     					}
	     				}},
			        {field:'paynote',title:'付款备注',width:115,align:'center',editor: {type: 'text'}}
		         ]]
	});
	userId=$("#userId").val();
	clearFormAndTable();
	$("#inoutMaker").val(userId);
	$CommonUI.getDateBox("#makeDate").datebox("setValue",formatterDate(new Date()));
});

function searchInoutList(){
	$CommonUI.getDialog("#quoteInoutListDlg").dialog("open").dialog('center');
	$CommonUI.getForm("#quoteInoutSearchForm").form('clear');
	$('#inoutList').datagrid({
		url:$WEB_ROOT_PATH + '/purchaseManage/inStoreCtrl.ajax',
		height:308,
		pageNumber:1,
		fitColumns:true,
		singleSelect:true,
		rownumbers: false,
		pagination: true,
		scrollbarSize:0,
		columns:[[
		          {field:'ck',checkbox:true},
			      {title: "入库单号",field: "inoutid",align:'center',width: 100},
			      {title: "采购科室",field: "orgnameApply",align:'center',width: 80},
			      {title: "制单人",field: "empname",align:'center',width:50},
			      {title: "入库总金额（元）",field: "amountTotal",align:'center',width:80},
			      {title: "入库日期",field: "inoutdatetime",align:'center',width: 70,
			    	  formatter:function(value,row,index){
	    		    		if(row.inoutdatetime!=""&&row.inoutdatetime!=null){
	 							var inoutdatetime = row.inoutdatetime.substr(0,10);
	 							return inoutdatetime;
	 							
	 						}
	    		    		
	    		    	}	  
			      },
			      {title: "审核人",field: "checkname",align:'center',width:50},
			      {title: "供应商",field: "entname",align:'center',width: 100},
			   ]],
   queryParams:{page : 1,rows : 10,'status':'1'},
	});
}
function closeQuoteDlg(){
	$CommonUI.getDialog("#quoteInoutListDlg").dialog("close");
}

//确定引用入库单
function quoteThisinout(){
	f='1';
	var selected = $('#inoutList').datagrid('getSelected');
	if(selected!=null){
		postReq($WEB_ROOT_PATH + '/purchaseManage/stockMgrCtrl.ajax?BLHMI=getSavedData', 
				'', function(data){
			        if(data.mePlSubBean.length!=0){
			        	$CommonUI.getDataGrid('#inoutDetail').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
						if(data.mePlSubBean!=""){
							for ( var i = 0; i < $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows').length; i++) {
								//$('#inoutDetail').datagrid('endEdit',i);
								$CommonUI.getDataGrid('#inoutDetail').datagrid('beginEdit',i);
								$('#inoutDetail').datagrid('getRows')[i].uuid =data.mePlSubBean[i].uuid;
							 }
						}	
						//$('#purId').val(documentno);
						$('#org').combobox('setValue',selected.orgid);
						$('#inoutMaker').val(userId);
						$('#wholeCurrency').val(selected.amountTotal);
						$('#entid').combobox('setValue',selected.entid);
						//$('#supportComboGridIn').combogrid('setValue',msg["rows"][0].supporter);
						$('#inoutid').val(selected.inoutid);
//						if(selected.inoutdatetime!=""&&selected.inoutdatetime!=null){
// 							var inoutdatetime = selected.inoutdatetime.substr(0,10);
// 						
// 							$('#makeDate').val(inoutdatetime);
// 						}
//						
					}else{
						clearFormAndTable();
					}
//				$CommonUI.confirm("确定引用该入库单?",'question','确定',function(){
//					if(msg["total"]!=0){
//						$('#org').combobox('setValue',msg["rows"][0].orgid);
//						//$('#org').val(msg["rows"][0].orgname);
//						$('#inoutMaker').val(msg["rows"][0].empname);
//						$('#wholeCurrency').val(msg["rows"][0].totalPrice);
//						$("#support").combogrid("setValue",msg["rows"][0].supporter);
//						$('#inoutid').val(msg["rows"][0].inoutid);
//						$('#makeDate').val(msg["rows"][0].inoutdatetime);
//						$('#note').val(msg["rows"][0].note);
//						$('#inoutDetail').datagrid('loadData',msg);
//						var length = $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows').length;
//						for(var i=0; i<length; i++){
//							$CommonUI.getDataGrid('#inoutDetail').datagrid('beginEdit',i);
//						}
//					}else{
//						clearFormAndTable();
//					}
					$CommonUI.getDialog("#quoteInoutListDlg").dialog("close");
//				});
		}, function(){
			$CommonUI.alert("引用入库单失败！");
		}, '', {"inoutid":selected.inoutid});
	}else{
		$CommonUI.alert("请选择一条入库单");
	}
}
//入库单条件查询
function searchinout(){
//	preventDuplicateSubmission(2000);
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 2000)) {
    	return;
    }
	var inoutid = $('#inoutid_s').val();
	var inoutStartDate = $CommonUI.getDateBox('#inoutStartDate_s').datebox('getValue');
	var inoutEndDate = $CommonUI.getDateBox('#inoutEndDate_s').datebox('getValue');
	var orgid=$CommonUI.getComboBox('#org_s').combobox('getValue');
	if(orgid=='undefined'){
		orgid='';
	}
	var state = $('#checkSelect').val();
/*	if((inoutStartDate == "" && inoutEndDate != "") || (inoutStartDate != "" && inoutEndDate == "")) {
		if(inoutStartDate == ""){
			$CommonUI.alert("请选择开始日期");
		}else{
			$CommonUI.alert("请选择结束日期");
		}
	}else{*/
	if(inoutStartDate!=''&&inoutEndDate!=''){
		if(inoutStartDate>inoutEndDate){
			$CommonUI.alert("结束日期不能小于开始日期");
		}
	}
	$CommonUI.getDataGrid('#inoutList').datagrid({
		queryParams:{
			'orgName':orgid,
			'uuid':inoutid,
			'startDate':inoutStartDate,
			'endDate':inoutEndDate,
			'status':'1'
		}
	});
//		$CommonUI.getForm("#quoteInoutSearchForm").form('clear');
}

//清空
function clearFormAndTable(){
	$CommonUI.getForm('#inoutMTbForm').form('clear');
	$CommonUI.getDataGrid('#inoutDetail').datagrid('loadData',{"total":"0","rows":[]});
}

//结算
function financialAndStCur() {
//	preventDuplicateSubmission(1000);
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 1000)) {
    	return;
    }
	var length = $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows').length;
	if(length>0){
//	if($('#support').combogrid('grid').datagrid('getSelected')==null){
//		$CommonUI.alert("请选择供应商！");
//		return;
//	}
//	if($('#payWay').combobox('getValue')==""){
//		$CommonUI.alert("请选择支付方式！");
//		return;
//	}
	var flag=false;
	var storeString = "";
	var Fields = new Array();
	var row = $CommonUI.getDataGrid('#inoutDetail').datagrid('getData')["rows"];
	for(var i=0; i<length; i++){
		var ed1 = $CommonUI.getDataGrid('#inoutDetail').datagrid('getEditor', {index:i,field:'payAmount'});
		var ed2 = $CommonUI.getDataGrid('#inoutDetail').datagrid('getEditor', {index:i,field:'invoiceno'});
		if(ed1!=null){
			d1 = $(ed1.target).val();
		}else{
			d1 = $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows')[i].payAmount;
		}
		if(ed2!=null){
			d2 = $(ed2.target).val();
		}else{
			d2 = $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows')[i].invoiceno;
		}
		if(d1!="" && d2!=""){
			$('#inoutDetail').datagrid('endEdit', i);
		}else{
			flag=true;
		}
	}
	if(flag){
		$CommonUI.alert("请检查处于编辑状态的行，发票号和付款金额不可为空!");
		return;
	}
	for(var i=0; i<length; i++){
		var Field = new Object();
		Field.invoiceno = row[i].invoiceno;
		Field.uuidst = row[i].uuid;
		Field.direct = $("#direct").val();
		Field.wholesalesAmount = row[i].wholesalesAmount;
		Field.amountotal = row[i].payAmount;
		Field.paynote = row[i].paynote;
		Field.inoutid = $("#inoutid").val();
		//Field.payuuid = row[i].payuuid;
	//	Field.payid = row[i].payid;
		if(row[i].payAmount==row[i].wholesalesAmount){
			Field.ispayoff = '1';
		}else{
			Field.ispayoff = '0';
		}
		Fields[i] = Field;
	}
	storeString = $.toJSON(Fields);
	if(storeString=="[]"){
		return;
	}
	var payorgid=$('#org').combobox('getValue');//科室
	if(f=='1'){
		postReq($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=paySave&fields='+storeString, '',function(msg){
			clearFormAndTable();
			$CommonUI.autoCloseCenterMessage("结算成功！","info","提示",500);
		},function(){
			$CommonUI.alert("结算失败！");
		},{skipHidden : false},
		{
			"payorgid":payorgid,
			"inoutid":$('#inoutid').val(),
			"payamounttoal":$("#wholeCurrency").val(),

			"storeString":storeString,
			
			 "entid":$('#entid').combobox('getValue'),
			"payway":$('#payWay').combobox('getValue')
		});
	}else if(f=='2'){
		$CommonUI.confirm('已结算！是否继续追加？', 'question', 0, function(){
			postReq($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=paySave&fields='+storeString, '',function(msg){
				clearFormAndTable();
				$CommonUI.autoCloseCenterMessage("结算成功！","info","提示",500);
			},function(){
				$CommonUI.alert("结算失败！");
			},{skipHidden : false},
			{
				"payorgid":payorgid,
				"payamounttoal":$("#wholeCurrency").val(),
				"inoutid":$('#inoutid').val(),
				"storeString":storeString,
				
				"entid":$('#entid').combobox('getValue'),
				"payway":$('#payWay').combobox('getValue')
			});
		});
	}
	
	}
}

//付款历史记录弹窗
function paymentList() {
	$CommonUI.getDialog("#payListDlg").dialog("open").dialog('center');
	$CommonUI.getForm("#paySearchForm").form('clear');
	$('#payList').datagrid({
		url:$WEB_ROOT_PATH + '/purchaseManage/payCtrl.ajax',
		height:308,
		pageNumber:1,
		fitColumns:true,
		singleSelect:true,
		rownumbers: false,
		pagination: true,
		scrollbarSize:0,
		pageNumber:1,
		columns:[[
			      {title: "入库单号",field: "inoutid",align:'center',width: 130},
			      {title: "应付总金额",field: "payamounttoal",align:'center',width:75},
			      {title: "已支付",field: "paiedTotal",align:'center',width:60},
			      {title: "付款方式",field: "paywayName",align:'center',width: 60},
			      {title: "付款人",field: "empname",align:'center',width:60},
			      {title: "付款日期",field: "paydatetimer",align:'center',width: 60,
			    	  formatter:function(value,row,index){
	    		    		if(row.paydatetimer!=""&&row.paydatetimer!=null){
	 							var paydatetimer = row.paydatetimer.substr(0,10);
	 							return paydatetimer;
	 							
	 						}
	    		    		
	    		    	}	
			      },
			      {title: "供应商",field: "entname",align:'center',width: 120},
			      {title: "操作",field: "show",align:'center',width: 40,formatter:function(value,row,index){
			    	  return '<a href="javascript:payShow(\''+row.inoutid+'\',\''+row.payorgid+'\',\''+row.payamounttoal+'\',\''+row.empname+'\',\''+row.paydatetimer+'\',\''+row.entid+'\',\''+row.payway+'\')">查看</a>';
			      }}
			   ]],
   queryParams:{page : 1,rows : 10},
	});
}
//支付查询
function searchinoutForPay() {
//	preventDuplicateSubmission(2000);
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 2000)) {
    	return;
    }
	$CommonUI.getDataGrid('#payList').datagrid({
		url:$WEB_ROOT_PATH+'/purchaseManage/payCtrl.ajax',
		queryParams:{
			'uuid':$('#inoutidForPay').val(),
			'startDate':$('#payDate').datebox('getValue')
		}
	});
//	$CommonUI.getForm("#paySearchForm").form('clear');
}

//支付引用确认
function payShow(inoutid,payorgid,payamounttoal,payer,paydatetimer,entid,payWay){
	f='2';
	postReq($WEB_ROOT_PATH + '/purchaseManage/stockMgrCtrl.ajax?BLHMI=paiedDatas', 
			'', function(data){
		        if(data.mePlSubBean!='undefined'){
		        	$CommonUI.getDataGrid('#inoutDetail').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
					
					for ( var i = 0; i < $CommonUI.getDataGrid('#inoutDetail').datagrid('getRows').length; i++) {
						//$('#inoutDetail').datagrid('endEdit',i);
						$CommonUI.getDataGrid('#inoutDetail').datagrid('beginEdit',i);
						var invoicenoEditor = $CommonUI.getDataGrid('#inoutDetail').datagrid('getEditor',{index:i,field:'invoiceno'});
						$(invoicenoEditor.target).attr({'disabled':true});
						//$('#inoutDetail').datagrid('getRows')[i].uuid =data.mePlSubBean[i].uuid;
					 }
				
					$('#org').combobox('setValue',payorgid);
					//$('#org').val(msg["rows"][0].orgname);
					if(payer!='undefined'){
						$('#inoutMaker').val(payer);
					}
					
					if(payamounttoal!='undefined'){
						$('#wholeCurrency').val(payamounttoal);
					}
					if(inoutid!='undefined'){
						$('#inoutid').val(inoutid);
					}
					$('#entid').combobox('setValue',entid);
					//$("#support").combogrid("setValue",entid);
					
					$('#payWay').combobox('setValue',payWay);
					
					if(paydatetimer!=""&&paydatetimer!=null){
							var paydatetimer = paydatetimer.substr(0,10);
							$CommonUI.getDateBox("#makeDate").datebox("setValue",paydatetimer);
						}
					
				}else{
					clearFormAndTable();
				}

				$CommonUI.getDialog("#payListDlg").dialog("close");
	}, function(){
		$CommonUI.alert("查看失败！");
	}, '', {"inoutid":inoutid});
}
//关闭支付弹窗
function closePayListDlg(){
	$CommonUI.getDialog("#payListDlg").dialog("close");
}
var date = new Array();
function preventDuplicateSubmission(time){
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < time)) {
    	return;
    }
}
//日期转化格式
var formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

