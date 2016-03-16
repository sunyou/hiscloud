var date = new Array();
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
	PlaceHolder.create(document.getElementById('matchitem'));
	userId=$("#userId").val();
   
	
	//入库药品信息table
	$CommonUI.getDataGrid('#itemsTable').datagrid({
		height:400,
		fitColumns:false,
		striped:true,
		singleSelect:true,
		rownumbers: true,
		pagination: false,
		onClickCell: function(index,field,value){
			
			if(field == 'action') {
				if($('#actionFlag').val()!=1&&$('#actionFlag').val()!=2){
					var row=$CommonUI.getDataGrid('#itemsTable').datagrid('getData')["rows"][index];
					var tip = "";
					if(row.uuid==undefined){
						tip="<b>页面</b>";
					}else{
						tip="<b>库里</b>";
					}
					$CommonUI.confirm("您确定从"+tip+"删除该项目？", 'warning', '确定', function(){
						if(row.uuid==undefined){
							succDelete(index);
						}else{
							postReq($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=delete&uuidplan='+row.uuid, '', function(){
								$CommonUI.alert("删除成功");
								succDelete(index);
							}, function(){
								$CommonUI.alert("未能从库中删除该数据");
							}, {skipHidden:false}, {"uuid":row.uuid,"inoutid":row.inoutid,"wholesalesAmount":row.wholesalesAmount});
						}
					 }, '取消', '', '', false);
			}else{
				if($('#actionFlag').val()==1){
					$CommonUI.alert("不可删除采购单项目！");
				}else if($('#actionFlag').val()==2) {
					if(field == 'action') {
						$CommonUI.alert("已审核入库单，不可删除！");}
					return;
				}
			}}
			if(field=='unitquantity' || field=='unitPurPrice'){
				/*if(!$('#sureBtn').linkbutton('options').disabled){
					$('#sureBtn').linkbutton('disable');
				}*/
				$('#sureBtn').attr("disabled","disabled");
				quantityOrPriceEdit(index,field,value);
			}
		},
		onDblClickRow:function(rowIndex, rowData){
			if($('#actionFlag').val()!=2) {//2表示已入库审核
				/*if(!$('#sureBtn').linkbutton('options').disabled){
					$('#sureBtn').linkbutton('disable');
				}*/
				$('#sureBtn').attr("disabled","disabled");
				$('#itemsTable').datagrid('beginEdit', rowIndex);
				var salePriceEditor = $('#itemsTable').datagrid('getEditor',{index: rowIndex, field: 'unitSalePrice'});
				$(salePriceEditor.target).attr({"disabled": true});
				var warehousUnitEditor = $('#itemsTable').datagrid('getEditor', {index:rowIndex,field:'unitname'});
				if(rowData.warehousUnit!=rowData.dispensUnit){
					$(warehousUnitEditor.target).combo(
							$.extend({},$.fn.validatebox.defaults,{
								editable:false,panelHeight:44,disabled:false,hasDownArrow:true}
						));
					$(warehousUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.warehousUnit},{"value":rowData.dispensUnit}]});
				}else{
					$(warehousUnitEditor.target).combo(
							$.extend({},$.fn.validatebox.defaults,{
								editable:false,panelHeight:22,disabled:true,hasDownArrow:false}
						));
					$(warehousUnitEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
				}
				if(rowData.unitname==undefined){//添加药品时双击
					$(warehousUnitEditor.target).combobox('setValue',rowData.warehousUnit);
				}else{//已入库，再次更新
					$(warehousUnitEditor.target).combobox('setValue',rowData.unitname);
				}
				var wholesalesAmountEditor = $('#itemsTable').datagrid('getEditor', {index:rowIndex,field:'wholesalesAmount'});
				$(wholesalesAmountEditor.target).attr({"disabled":true});
			}else{
				$CommonUI.alert("入库单已审核，不可修改！");
			}
		},
	    columns:[[  
	              	{field:'uuid',title:'唯一编码',hidden:true},
		  	        {field:'itemid',title:'项目编码',hidden:true},
		  	        {field:'itemname',title:'药品名称',width:90,align:'center',
		  	        	formatter:function(value,row,index){
     					return "<div align='left'>"+value+"</div>";
     				}},
			        {field:'itemSpec',title:'药品规格',width:90,align:'center'},
			        {field:'unitquantity',title:'数量',width:80,align:'center',editor: {type: 'text'}},
			        {field:'unitname',title:'单位',width:50,align:'center',editor:{type:'combobox',
			        	options:{valueField: 'value',textField: 'value',onSelect:unitSelect}}},
			        {field:'unitPurPrice',title:'进价',width:90,align:'center',editor: {type: 'text'}},
			        {field:'unitSalePrice',title:'售价',width:90,align:'center',editor: {type: 'text'}},
			        {field:'wholesalesAmount',title:'购入总价',width:90,align:'center',editor:{type:'text'}},
			        {field:'batchcode',title:'批号',width:90,align:'center',editor: {type: 'text'}},
			        {field:'expiryDate',title:'失效日期',width:100,align:'center',
			        	editor: {type: 'datebox',options:{onSelect:expirationWarning,editable:false}}},
			        {field:'creatDate',title:'生产日期',width:100,align:'center',
			        	editor: {type: 'datebox',options:{onSelect:productionWaring,editable:false}}},
		        	{field:'invoiceno',title:'发票号',width:90,align:'center',editor: {type: 'text'}},
		        	{field:'producerName',title:'生产厂家',width:140,align:'center'},
			        {field:'action',title:'操作',width:40,align:'center',formatter:function(value,row,index){
			        	return '<a href="javascript:void(0)">删除</a>';
			        }}
		         ]]
	});
	//引用采购单关闭按钮
	$("#qtordDlgClose").click(function(){
		$CommonUI.getDialog("#quotePurDlg").dialog("close");
	});
	//药品选择关闭按钮
	$("#itemsSelectDlgClose").click(function(){
		$CommonUI.getDialog("#itemsSelectDlg").dialog("close");
	});
	clearFormAndTable();//重新载入框架时清空页面
	$("#purMaker").val(userId);
	$CommonUI.getDateBox("#makeDate").datebox("setValue",formatterDate(new Date()));
});
//生产日期提示
function productionWaring(value){
	if(value>(new Date())){
		$CommonUI.alert("生产日期小于今天，请核对！","warning");
	}
}
//失效日期提示
function expirationWarning(value){
	if(value<(new Date())){
		$CommonUI.alert("药品已过期","warning");
	}
}
//单位对售价的改变
function unitSelect(data){
	var selectedRow = $('#itemsTable').datagrid("getSelected");
    var selectedIndex = $('#itemsTable').datagrid("getRowIndex", selectedRow);
	var salesPriceEditor = $('#itemsTable').datagrid('getEditor',{index:selectedIndex,field:'unitSalePrice'});
	if(data.value!=selectedRow.dispensUnit){//不管是入库之后对单位的更新，还是选择药品的，都按零售单位作为判断条件即可
		$(salesPriceEditor.target).val(selectedRow.salesPrice*selectedRow.warehousFacotr/selectedRow.dispensFacotr);
	}else{
		$(salesPriceEditor.target).val(selectedRow.salesPrice);
	}
}

function succDelete(index){
	/*if(!$('#sureBtn').linkbutton('options').disabled){
		$('#sureBtn').linkbutton('disable');
	}*/
	$('#sureBtn').attr("disabled","disabled");
	$('#itemsTable').datagrid('endEdit',index);
	var price =  $('#itemsTable').datagrid('getSelected').wholesalesAmount;
	$('#wholeSaleTotalPrice').val(Number($('#wholeSaleTotalPrice').val())-Number(price).toFixed(2));
	$('#itemsTable').datagrid('deleteRow',index);
}
//引用采购单弹窗
function quoteOrder(){
	$CommonUI.getDialog("#quotePurDlg").dialog({modal:true}).dialog("open");
	$CommonUI.getForm("#quotePurSearchForm").form('clear');
	var url = $WEB_ROOT_PATH+'/purchaseManage/drugPurchaseCtrl.ajax';
	var columns = [[
			          {field:'ck',checkbox:true},
				      {title: "采购单号",field: "uuid",align:'center',width: 100},
				      {title: "采购部门",field: "orgnameApply",align:'center',width: 80},
				      {title: "采购日期",field: "purchasemakeDate",align:'center',width: 70,
				    	  formatter:function(value,row,index){
		    		    		if(row.purchasemakeDate!=""&&row.purchasemakeDate!=null){
		 							var purchasemakeDate = row.purchasemakeDate.substr(0,10);
		 							return purchasemakeDate;
		 							
		 						}
		    		    		
		    		    	}	
				      
				      },
				      {title: "采购人",field: "empname",align:'center',width:50},
				      {title: "采购总价",field: "amountTotal",align:'center',width:50},
				      {title: "供应商",field: "entname",align:'center',width: 100},
				   ]];
	var queryParams = {page : 1,rows : 10,'status':'1'};
	var options = {height : 310,singleSelect: true,pagination: true,rownumbers:true,fitColumns:true,onCheck:function(){}};
	var sortOpts = {remoteSort: false,sortName: '',sortOrder: 'asc'};
	var pageOpts = {pageNumber: 1,pageSize: 10};
	$CommonUI.datagrid('#purList', url, queryParams, columns, pageOpts, sortOpts, options);
}
//引用采购单关闭弹窗
function closePurDlg(){
	$CommonUI.getDialog("#quotePurDlg").dialog("close");
}

//药品选择弹窗以及页面初始化
function itemsSelect(){
	$CommonUI.getDialog("#itemsSelectDlg").dialog({modal:true}).dialog("open").dialog('center');
	$CommonUI.getForm("#itemsForm").form('clear');
	var url = $WEB_ROOT_PATH +'/purchaseManage/drugCommonCtrl.ajax?BLHMI=itemsList&ismeditem=1';
	var columns = [[ 
	            	{field:'ck',checkbox:true},
	        		{field:'itemname',title:'药品名称',width:190,align:'center'},
	        		{field:'ordCatename',title:'药品分类',width:190,align:'center'}, 
	        		{field:'itemid',title:'项目编码',width:190,align:'center',hidden:true },
	        		{field:'itemSpec',title:'药品规格',width:190,align:'center'}, 
	        		{field:'basicUnit',title:'小单位',width:190,align:'center'}, 
	        		{field:'dispensUnit',title:'大单位',width:190,align:'center'},    
	        		{field:'itemDosename',title:'剂型单位',width:280,align:'center'},
	        		{field:'producerName',title:'生产商家',width:210,align:'center'}
		         ]];
	var queryParams = {page : 1,rows : 10,"medicine":$('#matchitem').val(),"status":'1',};
	var sortOpts = {remoteSort: false,sortName: '',sortOrder: 'asc'};
	var pageOpts = {pageNumber: 1,pageSize: 10};
	var options = {height : 310,singleSelect: false,pagination: true,rownumbers:true,fitColumns:true,scrollbarSize:0,
			onCheck: onCheck,onUncheck:onUncheck,onCheckAll:ckOrSlAll};
	$CommonUI.datagrid('#itemsTb', url, queryParams, columns, pageOpts, sortOpts, options);
}
//关闭药品选择弹窗
function closedgSlDlg(){
	$CommonUI.getDialog("#itemsSelectDlg").dialog("close");
}
//选择药品onCheck事件
var onCheck = function(rowIndex, rowData) {
	var flag = "";
	var length = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;
	if(length == 0){
		addItem(rowData,length);
	}else{
		for(var i=0;i<length;i++){
    		if(rowData.itemid != $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].itemid){
    			flag = true;
    		}else{
    			flag = false;
    			break;
    		}
    	}
	}
	if(flag == true){
		addItem(rowData,length);
	}
};

//选择药品onUncheck事件
var onUncheck = function(rowIndex, rowData) {
	for(var i=0;i<$CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;i++){
		if(rowData.itemid == $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].itemid){
			if($('#actionFlag').val()!=3) {//3未审核的历史记录
				$CommonUI.getDataGrid('#itemsTable').datagrid('deleteRow',i);
			}else {
				var isSavedItem = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].uuid;
				if(isSavedItem==undefined){//如果是选择的药品，可以直接在页面删除，如果是已保存数据则不可
					$CommonUI.getDataGrid('#itemsTable').datagrid('deleteRow',i);
				}
			}
		}
	}
};

//全选
var ckOrSlAll = function(rows){
//	$CommonUI.showMessage('数据加载中......', 'info', '', 1000, true, true, '', '', '', '', false);
	var length = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;
	if(length == 0){
		for(var i=0;i<rows.length;i++){
			var rowData = rows[i];
			addItem(rowData,i);
			}
	}else{
		var flag = "";//是否可添加
		for(var j=0;j<rows.length;j++){
			for(var i=0;i<$CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;i++){
		    	if(rows[j].itemid != $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].itemid){
		    		flag = true;
		    	}else{
		    		flag = false;
		    		break;
		    	}
			}
			if(flag == true){
				var rowData = rows[j];
				addItem(rowData,i);
	    	}
		}
	}
};

//药品添加
function addItem(rowData,length){
	//对置灰按钮添加判断，防止按钮本身disabled属性为true时再次置灰，开启时看起来是开启了，但是disabled属性依然是true
	/*if(!$('#sureBtn').linkbutton('options').disabled){
		$('#sureBtn').linkbutton('disable');
	}*/
	$('#sureBtn').attr("disabled","disabled");
	$CommonUI.getDataGrid('#itemsTable').datagrid('appendRow',rowData);
	$CommonUI.getDataGrid('#itemsTable').datagrid('beginEdit', length);
	var wholesalesPriceEditor = $('#itemsTable').datagrid('getEditor', {index:length,field:'unitPurPrice'});
	var salesPriceEditor = $('#itemsTable').datagrid('getEditor', {index:length,field:'unitSalePrice'});
	var wholesalesAmountEditor = $('#itemsTable').datagrid('getEditor', {index:length,field:'wholesalesAmount'});
	var warehousUnitEditor = $('#itemsTable').datagrid('getEditor', {index:length,field:'unitname'});
	if(rowData.warehousUnit==rowData.dispensUnit || rowData.warehousUnit==null || rowData.warehousUnit=="" || rowData.dispensUnit==null|| rowData.dispensUnit==""){
		$(warehousUnitEditor.target).combo(
			$.extend({},$.fn.validatebox.defaults,{
				editable:false,panelHeight:22,disabled:true,hasDownArrow:false}
		));
		if(rowData.warehousUnit==null || rowData.warehousUnit==""){//没有库存单位，其实在选择药品时已经过滤，但是数据原因，所以添加判断。
			$(warehousUnitEditor.target).combobox('setValue',rowData.dispensUnit);
			$(wholesalesPriceEditor.target).val(rowData.wholesalesPrice);//项目基本信息表中所有价格都是相对于零售单位而言的
		}else{
			$(warehousUnitEditor.target).combobox('setValue',rowData.warehousUnit);
			$(wholesalesPriceEditor.target).val(rowData.wholesalesPrice*rowData.warehousFacotr/rowData.dispensFacotr);
		}
		$(salesPriceEditor.target).val(rowData.salesPrice);
	}else{
		$(warehousUnitEditor.target).combo(
				$.extend({},$.fn.validatebox.defaults,{
					editable:false,panelHeight:44,disabled:false,hasDownArrow:true}
			));
		$(warehousUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.warehousUnit},{"value":rowData.dispensUnit}]});
		$(warehousUnitEditor.target).combobox('setValue',rowData.warehousUnit);
		$(wholesalesPriceEditor.target).val(rowData.wholesalesPrice*rowData.warehousFacotr/rowData.dispensFacotr);
		$(salesPriceEditor.target).val(rowData.salesPrice*rowData.warehousFacotr/rowData.dispensFacotr);
	}
	$(salesPriceEditor.target).attr({"disabled":true});
	$(wholesalesAmountEditor.target).attr({"disabled":true});
}

//引用采购单查询
function searchPurchase(){
//	preventDuplicateSubmission(2000);
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 2000)) {
    	return;
    }
	var purchaseid = $('#purchaseid_s').val();
	var purStartDate = $CommonUI.getDateBox('#purStartDate_s').datebox('getValue');
	var purEndDate = $CommonUI.getDateBox('#purEndDate_s').datebox('getValue');
/*	if((purStartDate == "" && purEndDate != "") || (purStartDate != "" && purEndDate == "")) {
		if(purStartDate == ""){
			$CommonUI.alert("请选择开始日期！");
		}else{
			$CommonUI.alert("请选择结束日期！");
		}
	}else{*/
	if(purStartDate!=''&&purEndDate!=''){
		if(purStartDate>purEndDate){
			$CommonUI.alert("结束日期不能小于开始日期！");
		}
	}
	$CommonUI.getDataGrid('#purList').datagrid({
		url:$WEB_ROOT_PATH+'/purchaseManage/drugPurchaseCtrl.ajax',
		queryParams:{
			'status':'1',
			'uuid':purchaseid,
			'startDate':purStartDate,
			'endDate':purEndDate
		
		}
	});
//		$CommonUI.getForm("#quotePurSearchForm").form('clear');
	
}
//药品入库保存按钮
function saveItems(){
	var orgid=$('#org').combobox('getValue');
	if (orgid=='' || orgid==null){
		$CommonUI.alert("请选择采购科室！","warning");
		return;
	}
	
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 1000)) {
    	return;
    }
	var flag=false;
	var length = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;
	if(length != 0){
		//if($('#org').combogrid('grid').datagrid('getSelected')==null){
		if($('#entid').combobox('getText')==""||$('#entid').combobox('getText')==null||$('#entid').combobox('getText')==undefined){
			$CommonUI.alert("请选择供应商！");
			return;
		}
		if($('#wholeSaleTotalPrice').val().indexOf(".")>6){
			$CommonUI.alert("请认真核对价格和数量！");
			return;
		}
		var d1=d2=d3=d4=d5='';
		for(var i=0;i<length;i++){
			var ed1 = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:i,field:'unitquantity'});
			var ed2 = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:i,field:'unitPurPrice'});
			var ed3 = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:i,field:'batchcode'});
			var ed4 = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:i,field:'creatDate'});
			var ed5 = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:i,field:'expiryDate'});
			if(ed1!=null){
				d1 = $(ed1.target).val();
			}else{
				d1 = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].unitquantity;
			}
			if(ed2!=null){
				d2 = $(ed2.target).val();
			}else{
				d2 = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].unitPurPrice;
			}
			if(ed3!=null){
				d3 = $(ed3.target).val();
			}else{
				d3 = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].batchcode;
			}
			if(ed4!=null){
				d4 = $(ed4.target).datebox('getValue');
			}else{
				d4 = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].creatDate;
			}
			if(ed5!=null){
				d5 = $(ed5.target).datebox('getValue');
			}else{
				d5 = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].expiryDate;
			}
			if(d5==undefined){
				d5='';
			}
			if(d4==undefined){
				d4='';
			}
			/*if(d1!=""&&d2!=""&&d3!=""&&d4!=""&&d5!=""){*/
			if(d1!=""&&d2!=""&&d3!=""&&d5!=""){
				if(d1<=0){
					$CommonUI.alert("数量必须大于零！");
					return;
				}
				if(d2<=0){
					$CommonUI.alert("进价必须大于零！");
					return;
				}
				/*var result1 = d4.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
				if (result1==null){
					$CommonUI.alert("生产日期格式不正确！","warning");
					return;
				}*/
				var result2 = d5.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
				if (result2==null){
					$CommonUI.alert("失效日期格式不正确！","warning");
					return;
				}
				if(d4>d5){
					$CommonUI.autoCloseCenterMessage("生产日期不能大于失效日期！","warning","",1000);
					 return;
				}
				$('#itemsTable').datagrid('endEdit', i);
			}else if(d4!="") {
				var result1 = d4.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
				if (result1==null){
					$CommonUI.alert("生产日期格式不正确！","warning");
					return;
				}
			}else {
				flag=true;
			}
		}
	}else{
		return;
	}
	if(flag){
		$CommonUI.alert("请检查处于编辑状态的行，除发票号，生产日期，其他都是必填项!","warning");
		return;
	}
	json = $('#itemsTable').datagrid('getData');
	var Str="";
	var rows=json.rows;
	var Fields = new Array();
	var j=0;
//	提取需要数据，也可直接$.toJSON(rows)提取所有数据
	for(var i=0; i<rows.length; i++){
		var Field = new Object();
		Field.uuid = rows[i].uuid;//子表主键
		Field.itemid = rows[i].itemid;//项目编码
		Field.rowno = rows[i].rowno;
		Field.inoutid = rows[i].inoutid;
		Field.quantity = rows[i].unitquantity;//包装单位数量
		Field.dispensQuantity = rows[i].unitquantity;//包装单位数量
		Field.dispensUnit = rows[i].unitname;//单位名称
		Field.batchcode = rows[i].batchcode;//批次号
		if(rows[i].unitname==rows[i].dispensUnit){
			Field.factor = rows[i].dispensFacotr;//包装单位换算序数
			Field.unittype = '0002';
		}else{
			Field.factor = rows[i].warehousFacotr;//包装单位换算序数
			Field.unittype = '0003';
		}
		Field.salesPrice = rows[i].unitSalePrice;//零售单价
		Field.salesAmount = rows[i].unitSalePrice*rows[i].unitquantity;
		Field.wholesalesPrice = rows[i].unitPurPrice;//批发单价
		Field.wholesalesAmount = rows[i].unitPurPrice*rows[i].unitquantity;
		Field.creatDate = rows[i].creatDate;//生产日期
		Field.expiryDate = rows[i].expiryDate;//失效日期
		Field.invoiceno = rows[i].invoiceno;//发票号
		Fields[j] = Field;
		j++;
	}
	Str = $.toJSON(Fields);
	if(Str=="[]"){//如果没有填写数据，直接return
		return;
	}
	
	var url=$WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=inoutSaveOrUpdate&fields='+Str;
	postReq(url, '',function(data){
			$CommonUI.alert("保存成功！");
			$CommonUI.getDataGrid('#itemsTable').datagrid('acceptChanges');
			var inoutid =data.inoutid;
			 $('#inoutid').val(inoutid);
			 $.each(data.uuids, function(i, uuidBean) {
				 $('#itemsTable').datagrid('getRows')[i].uuid = uuidBean.uuid;
			 });
//			$.getJSON($WEB_ROOT_PATH+'/drugStorage/drugStorageCtrl.htm?BLHMI=getSavedData',
//				{'inoutid':inoutid},function(msg){
//					if(msg["total"]!=0){
//						$('#itemsTable').datagrid('loadData',msg);
//						$('#org').val(msg["rows"][0].orgname);
//						$('#inoutid').val(msg["rows"][0].inoutid);
//						$('#makeDate').val((msg["rows"][0].inoutdatetime).substr(0,10));
//						$('#purMaker').val(msg["rows"][0].empname);
//						$('#entid').combogrid('setValue',msg["rows"][0].supporter);
//						$('#inoutNote').val(msg["rows"][0].note);
//					}
//			});
			
			
			/*$('#sureBtn').linkbutton('enable');*/
			$('#sureBtn').removeAttr("disabled");
		},function(){
			$CommonUI.autoCloseCenterMessage("保存失败！","info",'提示',500);
		},{skipHidden : false},{
			"orgid":$('#org').combobox('getValue'),
			"documentno":$('#purId').val(),
			"inoutid":$('#inoutid').val(),
			"entid":$('#entid').combobox('getValue'),
			"note":$('#inoutNote').val(),
			"storeString":Str
		}
	);
}

//确认入库按钮
function sureSave(){
	/*preventDuplicateSubmission(1000);*/
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 1000)) {
    	return;
    }
	if($CommonUI.getDataGrid('#itemsTable').datagrid('getChanges')!=""){
		/*if(!$('#sureBtn').linkbutton('options').disabled){
			$('#sureBtn').linkbutton('disable');
		}*/
		$('#sureBtn').attr("disabled","disabled");
		$CommonUI.alert("请先保存");
		return;
	}
	postReq($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=confirmStorage', '', function(){
		clearFormAndTable();
		$CommonUI.alert("入库成功！");
		/*if(!$('#sureBtn').linkbutton('options').disabled){
			$('#sureBtn').linkbutton('disable');
		}*/
	}, '',{ skipHidden:false}, {"inoutid":$('#inoutid').val()});
}
/*function fillThisStore(rowIndex,rowData){
	var url = $WEB_ROOT_PATH + '/drugStorage/drugStorageCtrl.htm?BLHMI=inouidList';
	postReq(url,'',function(msg){
		$('#itemsTable').datagrid('loadData',msg);
	},function(){},{},{"dto.meInoutSub.inoutid":rowData.inoutid});
}*/
//引用采购单确定按钮
function quoteThisPurchase(){
	var selected = $('#purList').datagrid('getSelected');
	if(selected!=null){
		postReq($WEB_ROOT_PATH + '/purchaseManage/stockMgrCtrl.ajax?BLHMI=listPur&uuid='+selected.uuid, 
				'', function(data){
//				$CommonUI.confirm("确定引用该采购单?",'question','确定',function(){
					clearFormAndTable();
					/*if(!$('#selectItemsBtn').linkbutton('options').disabled){
						$('#selectItemsBtn').linkbutton('disable');
					}*/
					$('#selectItemsBtn').attr("disabled","disabled");;
					$CommonUI.getDialog("#quotePurDlg").dialog("close");
					if(data.length!=0){
						$('#org').combobox('setValue',data.orgid);
						$('#actionFlag').val(1);//引用采购单的状态标志位
						$('#purId').val(data.purId);
					//	$('#org').val(msg["rows"][0].orgname);
					 	$("#purMaker").val(userId);
						/*var purTotal = 0;
						for(var i=0; i<msg["total"]; i++){
							purTotal = Number(purTotal) + Number(msg["rows"][0].wholesalesAmount);
						}
						$('#purTotal').val(purTotal);*/
						$('#purTotal').val(data.totalPrice);
						$('#entid').combobox('setValue',data.entid);
						$CommonUI.getDateBox("#makeDate").datebox("setValue",formatterDate(new Date()));
					//	$('#makeDate').val(data.purchasemakeDate);
						if(data.mePlSubBean!=""){
							$CommonUI.getDataGrid('#itemsTable').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );

							for ( var i = 0; i < $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length; i++) {
								$CommonUI.getDataGrid('#itemsTable').datagrid('beginEdit',i);
								var warehousUnitEditor = $('#itemsTable').datagrid('getEditor', {index:i,field:'unitname'});
								//加上下面两行代码之后，如果不写value,则取不到值（value默认为空）
								$(warehousUnitEditor.target).combo(
									$.extend({},$.fn.validatebox.defaults,{
										editable:true,panelHeight:22,disabled:true,hasDownArrow:false,value:data.mePlSubBean[i].unitname}
								));
								var wholesalesAmountEditor = $('#itemsTable').datagrid('getEditor', {index:i,field:'wholesalesAmount'});
								$(wholesalesAmountEditor.target).attr({"disabled":true});
								$('#itemsTable').datagrid('getRows')[i].uuid='';
							 }
							
						}
//						$('#itemsTable').datagrid('loadData',data.mePlSubBean);
//						setAllEditor(data.mePlSubBean);
					}
//				});
		}, function(){
			clearFormAndTable();
			$CommonUI.alert("引用采购单失败！");
		}, '', {"purUuid":selected.uuid});
	}else{
		$CommonUI.alert("请选择一条采购单");
	}
}

//设置table所有可编辑栏为编辑状态
function setAllEditor(rowData){
	var length = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length;
	for(var i=0; i<length;i++){
		$CommonUI.getDataGrid('#itemsTable').datagrid('beginEdit',i);
		var warehousUnitEditor = $('#itemsTable').datagrid('getEditor', {index:i,field:'unitname'});
		//加上下面两行代码之后，如果不写value,则取不到值（value默认为空）
		$(warehousUnitEditor.target).combo(
			$.extend({},$.fn.validatebox.defaults,{
				editable:true,panelHeight:22,disabled:true,hasDownArrow:false,value:rowData.unitname}
		));
		var wholesalesAmountEditor = $('#itemsTable').datagrid('getEditor', {index:i,field:'wholesalesAmount'});
		$(wholesalesAmountEditor.target).attr({"disabled":true});
	}
}
//药品选择窗口，药品点击事件
var itemGridClick = function (rowIndex,rowData){
	$CommonUI.queryForDataGrid("#itemsTb",{
		page : 1,rows : 10,
		"dto.itmeid":rowData.itemid,
	});
};
//药品分类
function itemSort(){
	var cateid = $('#itemSort_s').val();
	$CommonUI.queryForDataGrid("#itemsTb",{
		page : 1,rows : 10,
		"cateId":cateid,
	});
}
//父页面，药品检索
function matchItemIntable(inputstr){
	$CommonUI.getDataGrid('#itemsTable').datagrid('unselectAll');
	if(inputstr==""){
		return;
	}
//	var flag =true;
	$CommonUI.getDataGrid('#itemsTable').datagrid('options').singleSelect=false;
	var rows = $CommonUI.getDataGrid('#itemsTable').datagrid('getRows');
	for(var i=0;i<rows.length;i++){
		if((rows[i].itemname).indexOf(inputstr)!=-1||(rows[i].inputstr).indexOf(inputstr.toLowerCase())!=-1||(rows[i].inputstr).indexOf(inputstr.toUpperCase())!=-1){
			flag=false;
			$CommonUI.getDataGrid('#itemsTable').datagrid('selectRow',i);
		}
	}
	/*if(flag){
		$CommonUI.alert("没有匹配数据");
	}*/
	$('#itemsTable').datagrid('options').singleSelect=true;
}

//选择药品查询
function medetailpursearch(){
	var inputStr=$('#items_s').val();
	var cateid=$('#cateid').combobox('getValue');
	$CommonUI.queryForDataGrid("#itemsTb",{
		page : 1,rows : 10,
		"medicine":inputStr,
		"cateId":cateid
	});
}
//数量和价格输入框的控制
var quantityOrPriceEdit = function(index,field,value){
	var ed = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:index,field:''+field+''});
	if(ed !=null){
		$(ed.target).keyup(function(){
			//简单实现numberbox功能
		   if(this.value.indexOf(".")==this.value.lastIndexOf(".")){
			   $(ed.target).val($(ed.target).val().replace(/[^\d.]/g,''));
			   if(this.value.indexOf(".")!=-1){
				   this.value = this.value.substr(0, this.value.indexOf(".")+3);  //小数点后两位
			   }
		   }else{
			   this.value = this.value.substr(0, this.value.length - 1);
			}
		   this.value = this.value.substr(0, 6);//长度8位
		 /*  var unit = $CommonUI.getDataGrid('#itemsTable').datagrid('getEditor', {index:index,field:'unitname'});
		   if($(unit.target).combobox('getValue')==""){
			   return;
		   }*/
		   quantityOrPriceChanged();
		});
//		当焦点失去时，注销绑定事件（避免绑定多次造成多次调用函数），移除焦点（不移除焦点再次输入时，已经没有绑定keyup事件）
		$(ed.target).focusout(function(){
			$(this).unbind();//移除绑定事件
			$(this).blur();//丢失焦点以后移除焦点
		});
	}
};

//数量或者单价改变，计算出其对应总价
var quantityOrPriceChanged = function(){
	var selectedRow = $('#itemsTable').datagrid("getSelected");
    var selectedIndex = $('#itemsTable').datagrid("getRowIndex", selectedRow);
    //数量
	var quantityEditor = $('#itemsTable').datagrid('getEditor', {index:selectedIndex,field:'unitquantity'});
	var quantity = $(quantityEditor.target).val();
	//进价
	var wholesalesPriceEditor = $('#itemsTable').datagrid('getEditor', {index:selectedIndex,field:'unitPurPrice'});
	var wholesalesPrice = $(wholesalesPriceEditor.target).val();
	var wholesalesAmountEditor = $('#itemsTable').datagrid('getEditor', {index:selectedIndex,field:'wholesalesAmount'});
	//购入总价
	$(wholesalesAmountEditor.target).val((quantity*wholesalesPrice).toFixed(2));
	//	批发总金额
	wholeSalePriceCalc();
};

//批发价总金额计算
var wholeSalePriceCalc = function(){
	var index = $('#itemsTable').datagrid('getRows').length;
	var totalPrice=0;
	for(var i=0;i<index;i++){
		var wholesalesAmount = $('#itemsTable').datagrid('getEditor', {index:i,field:'wholesalesAmount'});
		if(wholesalesAmount!=null){
			if(!isNaN($(wholesalesAmount.target).val())){
				totalPrice = Number(totalPrice) + Number($($('#itemsTable').datagrid('getEditor', {index:i,field:'wholesalesAmount'}).target).val());
			}
		}else{
			totalPrice = Number(totalPrice) + Number($CommonUI.getDataGrid('#itemsTable').datagrid('getRows')[i].wholesalesPrice);
		}
	}
	$('#wholeSaleTotalPrice').val(totalPrice.toFixed(2));
};
//清空页面
function clearFormAndTable(){
	/*$('#selectItemsBtn').linkbutton('enable');
	$('#saveBtn').linkbutton('enable');
	if(!$('#sureBtn').linkbutton('options').disabled){
		$('#sureBtn').linkbutton('disable');
	}*/
	$('#selectItemsBtn').removeAttr("disabled");
	$('#saveBtn').removeAttr("disabled");
	$('#sureBtn').attr("disabled","disabled");
	$CommonUI.getForm('#inoutMTbForm').form('clear');
	$CommonUI.getDataGrid('#itemsTable').datagrid('loadData',{"total":"0","rows":[]});
}
//历史记录弹窗
function history() {
	$CommonUI.getDialog('#historyDlg').dialog('open').dialog('center');
	$CommonUI.getForm("#historySearchForm").form('clear');
	var url = $WEB_ROOT_PATH+'/purchaseManage/inStoreCtrl.ajax';
	var columns = [[
				      {title: "入库单号",field: "inoutid",align:'center',width: 160},
				      {title: "采购科室",field: "orgnameApply",align:'center',width: 80},
				      {title: "制单人",field: "empname",align:'center',width:50},
				      {title: "入库总金额",field: "amountTotal",align:'center',width:80},
				      {title: "入库日期",field: "inoutdatetime",align:'center',width: 70,
				    	  formatter:function(value,row,index){
		    		    		if(row.inoutdatetime!=""&&row.inoutdatetime!=null){
		 							var inoutdatetime = row.inoutdatetime.substr(0,10);
		 							return inoutdatetime;
		 							
		 						}
		    		    		
		    		    	}	  
				      },
				      {title: "审核人",field: "checkname",align:'center',width:50},
				      {title: "审核状态",field: "state",align:'center',width:70,formatter:function(value,row,index){
				    	  if(row.inoutcheckUserid ==null || row.inoutcheckUserid ==""){
				    		  return "未审核";
				    	  }else{
				    		  return "已审核";
				    	  }
				      }},
				      {title: "供应商",field: "entname",align:'center',width: 160},
				      {title: "操作",field: "action",align:'center',width: 50,formatter:function(value,row,index){
				    	 
				    	  return '<a href="javascript:showThisinout(\''+row.inoutid+'\',\''+row.inoutcheckUserid+'\',\''+row.documentno+'\',\''+row.orgid+'\',\''+row.inoutmakeUserid+'\',\''+row.inoutdatetime+'\',\''+row.amountTotal+'\',\''+row.entid+'\')">查看</a>';
				      }}
				   ]];
	var queryParams = {page : 1,rows : 10};
	var options = {height : 310,singleSelect: true,pagination: true,rownumbers:true,fitColumns:true,scrollbarSize:0,onCheck:function(){}};
	var sortOpts = {remoteSort: false,sortName: '',sortOrder: 'desc'};
	var pageOpts = {pageNumber: 1,pageSize: 10};
	$CommonUI.datagrid('#historyTable', url, queryParams, columns, pageOpts, sortOpts, options);
}
//历史记录查询
function searchinout() {
//	preventDuplicateSubmission(2000);
	date.push(new Date());
    if (date.length > 1 && (date[date.length - 1].getTime() - date[date.length - 2].getTime() < 2000)) {
    	return;
    }
	var inoutid = $('#inoutid_s').val();
	var inoutStartDate = $CommonUI.getDateBox('#inoutStartDate_s').datebox('getValue');
	var inoutEndDate = $CommonUI.getDateBox('#inoutEndDate_s').datebox('getValue');
	var state = $('#checkSelect').val();
	/*if((inoutStartDate == "" && inoutEndDate != "") || (inoutStartDate != "" && inoutEndDate == "")) {
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
	$CommonUI.getDataGrid('#historyTable').datagrid({
		queryParams:{
			'orgName':$('#org_s').combogrid('getValue'),
			//'inoutid':inoutid,
			'startDate':inoutStartDate,
			'endDate':inoutEndDate,
			'status':'1'
		}
	});

}

//历史记录查看
function showThisinout(inoutid,isChecked,documentno,orgid,inoutmakeUserid,inoutdatetime,amountTotal,entid) {
	postReq($WEB_ROOT_PATH + '/purchaseManage/stockMgrCtrl.ajax?BLHMI=getSavedData', 
			'', function(data){
		if(isChecked!=null&&isChecked!=""&&isChecked!="null"&&isChecked!="undefined"){
			/*if(!$('#selectItemsBtn').linkbutton('options').disabled){
				$('#selectItemsBtn').linkbutton('disable');
			}
			if(!$('#saveBtn').linkbutton('options').disabled){
				$('#saveBtn').linkbutton('disable');
			}
			if(!$('#sureBtn').linkbutton('options').disabled){
				$('#sureBtn').linkbutton('disable');
			}*/
			$('#selectItemsBtn').attr("disabled","disabled");
			$('#saveBtn').attr("disabled","disabled");
			$('#sureBtn').attr("disabled","disabled");
			$('#actionFlag').val(2);//查看历史记录标志位
		}else{
			$('#actionFlag').val("3");//可修改的历史记录
			if(documentno=='undefined'){
				documentno='';
			}
			if(documentno!="") {
				//引用采购单未审核也不可添加药品（严格引用）
				/*if(!$('#selectItemsBtn').linkbutton('options').disabled){
					$('#selectItemsBtn').linkbutton('disable');
				}*/
				$('#actionFlag').val(1);//查看历史记录标志位
				$('#selectItemsBtn').attr("disabled","disabled");;
			}else {//不是引用采购单，可以添加药品
				/*$('#selectItemsBtn').linkbutton('enable');*/
				$('#selectItemsBtn').removeAttr("disabled");
			}
			
			/*$('#saveBtn').linkbutton('enable');*/
			$('#saveBtn').removeAttr("disabled");
		}
		$CommonUI.getDialog("#historyDlg").dialog("close");
		$CommonUI.getDataGrid('#itemsTable').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
		if(data.mePlSubBean!=""){
			for ( var i = 0; i < $CommonUI.getDataGrid('#itemsTable').datagrid('getRows').length; i++) {
				$('#itemsTable').datagrid('endEdit',i);
				$('#itemsTable').datagrid('getRows')[i].uuid =data.mePlSubBean[i].uuid;
			 }
			
			
		}
		
		$('#purId').val(documentno);
		
		if(amountTotal!='undefined'){
			$('#wholeSaleTotalPrice').val(amountTotal);
		}
		$('#org').combobox('setValue',orgid);
		//$('#purMaker').val(inoutmakeUserid);
		
		$('#entid').combobox('setValue',entid);
		//$('#entid').combogrid('setValue',msg["rows"][0].supporter);
		if(inoutid!='undefined'){
			$('#inoutid').val(inoutid);
		}
		if(inoutdatetime!='undefined'){
			$('#makeDate').val(inoutdatetime);
		}
	
		
		//$('#inoutNote').val(msg["rows"][0].note);
		$CommonUI.getDataGrid('#itemsTable').datagrid('acceptChanges');
	
	}, function(){
		$CommonUI.alert("失败！");
	}, '', {"inoutid":inoutid});
}
//关闭历史记录弹窗
function closeHistoryDlg() {
	$CommonUI.getDialog('#historyDlg').dialog('close');
}
//防止数据重复提交，默认设置1s
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

//解决placceholder兼容
var PlaceHolder = {
	    _support: (function() {
	        return 'placeholder' in document.createElement('input');
	    })(),

	    //提示文字的样式，需要在页面中其他位置定义
	    className: 'abc',

	    init: function() {
	        if (!PlaceHolder._support) {
	            //未对textarea处理，需要的自己加上
	            var inputs = document.getElementsByTagName('input');
	            inputs.value = inputs.attributes.placeholder.nodeValue;
	            PlaceHolder.create(inputs);
	        }
	    },

	    create: function(inputs) {
	        var input;
	        if (!inputs.length) {
	            inputs = [inputs];
	        }
	        for (var i = 0, length = inputs.length; i <length; i++) {
	            input = inputs[i];
	            if (!PlaceHolder._support && input.attributes && input.attributes.placeholder) {
	            	PlaceHolder._setValue(input);
	                input.addEventListener('keydown', function(e) {
	                    if (this.value === this.attributes.placeholder.nodeValue) {
	                        this.value = '';
	                        this.className = '';
	                    }
	                }, false);
	                input.addEventListener('blur', function(e) {
	                    if (this.value === '') {
	                        PlaceHolder._setValue(this);
	                    }
	                }, false);
	            }
	        }
	    },

	    _setValue: function(input) {
	        input.value = input.attributes.placeholder.nodeValue;
	        input.className = PlaceHolder.className;
	    }
	};

